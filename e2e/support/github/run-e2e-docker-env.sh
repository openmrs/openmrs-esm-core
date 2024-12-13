#!/usr/bin/env bash -eu

# get the dir containing the script
script_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
repository_root="$script_dir/../../../."
# create a temporary working directory
working_dir=$(mktemp -d "${TMPDIR:-/tmp/}openmrs-e2e-frontends.XXXXXXXXXX")
echo $working_dir
# get a list of all the apps in this workspace
apps=$(yarn workspaces list --json | jq -r 'if .location | test("-app$") then .name else empty end')
# this array will hold all of the packed app names
app_names=()

echo "Creating packed archives of apps..."
# for each app
for app in $apps
do
  # @openmrs/esm-whatever -> _openmrs_esm_whatever
  app_name=$(echo "$app" | tr '[:punct:]' '_');
  # add to our array
  app_names+=("$app_name.tgz");
  # run yarn pack for our app and add it to the working directory
  yarn workspace "$app" pack -o "$working_dir/$app_name.tgz" >/dev/null;
done;
echo "Created packed app archives"

echo "Creating dynamic spa-assemble-config.json..."
# dynamically assemble our list of frontend modules, prepending the
# required apps; apps will all be in the /app directory of the Docker
# container
jq -n \
  --arg apps "$apps" \
  --arg app_names "$(echo ${app_names[@]})" \
  '{
    "@openmrs/esm-active-visits-app": "next",
    "@openmrs/esm-appointments-app": "next",
    "@openmrs/esm-bed-management-app": "next",
    "@openmrs/esm-cohort-builder-app": "next",
    "@openmrs/esm-dispensing-app": "next",
    "@openmrs/esm-fast-data-entry-app": "next",
    "@openmrs/esm-form-builder-app": "next",
    "@openmrs/esm-form-engine-app": "next",
    "@openmrs/esm-generic-patient-widgets-app": "next",
    "@openmrs/esm-home-app": "next",
    "@openmrs/esm-laboratory-app": "next",
    "@openmrs/esm-openconceptlab-app": "next",
    "@openmrs/esm-patient-allergies-app": "next",
    "@openmrs/esm-patient-attachments-app": "next",
    "@openmrs/esm-patient-banner-app": "next",
    "@openmrs/esm-patient-chart-app": "next",
    "@openmrs/esm-patient-conditions-app": "next",
    "@openmrs/esm-patient-flags-app": "next",
    "@openmrs/esm-patient-forms-app": "next",
    "@openmrs/esm-patient-immunizations-app": "next",
    "@openmrs/esm-patient-list-management-app": "next",
    "@openmrs/esm-patient-lists-app": "next",
    "@openmrs/esm-patient-medications-app": "next",
    "@openmrs/esm-patient-notes-app": "next",
    "@openmrs/esm-patient-orders-app": "next",
    "@openmrs/esm-patient-programs-app": "next",
    "@openmrs/esm-patient-registration-app": "next",
    "@openmrs/esm-patient-search-app": "next",
    "@openmrs/esm-patient-tests-app": "next",
    "@openmrs/esm-patient-vitals-app": "next",
    "@openmrs/esm-service-queues-app": "next",
    "@openmrs/esm-system-admin-app": "next",
    "@openmrs/esm-user-onboarding-app": "next",
    "@openmrs/esm-ward-app": "next",
    "@openmrs/esm-stock-management-app": "next",
    "@openmrs/esm-billing-app": "next"
  } + (
    ($apps | split("\n")) as $apps | ($app_names | split(" ") | map("/app/" + .)) as $app_files
    | [$apps, $app_files]
    | transpose
    | map({"key": .[0], "value": .[1]})
    | from_entries
  )' | jq '{"frontendModules": .}' > "$working_dir/spa-assemble-config.json"

echo "Created dynamic spa-assemble-config.json"

echo "Copying tooling, shell and framework..."
mkdir -p "$working_dir/packages"
mkdir -p "$working_dir/packages/tooling"

cp -r "$repository_root/.yarn" "$working_dir/.yarn"
cp -r "$repository_root/.yarnrc.yml" "$working_dir/.yarnrc.yml"
cp -r "$repository_root/packages/tooling" "$working_dir/packages"
cp -r "$repository_root/packages/shell" "$working_dir/packages"
cp -r "$repository_root/packages/framework" "$working_dir/packages"
cp "$repository_root/package.json" "$working_dir/package.json"
cp "$repository_root/yarn.lock" "$working_dir/yarn.lock"

echo "Copying Docker configuration..."
cp "$script_dir/Dockerfile" "$working_dir/Dockerfile"
cp "$script_dir/.dockerignore" "$working_dir/.dockerignore"
cp "$script_dir/docker-compose.yml" "$working_dir/docker-compose.yml"

cd $working_dir
echo "Starting Docker containers..."
# CACHE_BUST to ensure the assemble step is always run
docker compose build --build-arg CACHE_BUST=$(date +%s) frontend
docker compose up -d

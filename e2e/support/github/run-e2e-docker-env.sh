#!/usr/bin/env bash -eu

# get the dir containing the script
script_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
# create a temporary working directory
working_dir=$(mktemp -d "${TMPDIR:-/tmp/}openmrs-e2e-frontends.XXXXXXXXXX")
# get a list of all the apps in this workspace
apps=$(yarn workspaces list --json | jq -r 'if ((.location == ".") or (.location | test("-app") | not)) then halt else .name end')
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
  '(
    ($apps | split("\n")) as $apps | ($app_names | split(" ") | map("/app/" + .)) as $app_files
    | [$apps, $app_files]
    | transpose
    | map({"key": .[0], "value": .[1]})
    | from_entries
  )' | jq '{"frontendModules": .}' > "$working_dir/spa-assemble-config.json"
echo "Created dynamic spa-assemble-config.json"

echo "Copying Docker configuration..."
cp "$script_dir/Dockerfile" "$working_dir/Dockerfile"
cp "$script_dir/docker-compose.yml" "$working_dir/docker-compose.yml"

cd $working_dir
echo "Starting Docker containers..."
# CACHE_BUST to ensure the assemble step is always run
docker compose build --build-arg CACHE_BUST=$(date +%s) frontend
docker compose up -d

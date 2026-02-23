#!/usr/bin/env bash
set -eu

# E2E Test Runner for OpenMRS ESM Core
#
# Usage:
#   ./run-e2e-docker-env.sh [options] [-- playwright-args]
#
# Options:
#   --keep-on-failure    Keep Docker containers running if tests fail (for debugging)
#   --list               Use list reporter (CLI-friendly, no browser popup)
#
# Examples:
#   ./run-e2e-docker-env.sh                      # Run all tests
#   ./run-e2e-docker-env.sh -- --headed          # Run tests with browser visible
#   ./run-e2e-docker-env.sh -- login.spec.ts     # Run specific test file
#   ./run-e2e-docker-env.sh --keep-on-failure    # Keep containers on test failure
#   ./run-e2e-docker-env.sh --list               # CLI-friendly output (for AI tools)

# ============================================================================
# Configuration
# ============================================================================

script_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
repository_root="$script_dir/../../../."

# Parse arguments
keep_on_failure=false
use_list_reporter=false
playwright_args=()
while [[ $# -gt 0 ]]; do
  case $1 in
    --keep-on-failure)
      keep_on_failure=true
      shift
      ;;
    --list)
      use_list_reporter=true
      shift
      ;;
    --)
      shift
      playwright_args=("$@")
      break
      ;;
    *)
      playwright_args+=("$1")
      shift
      ;;
  esac
done

# ============================================================================
# Utility Functions
# ============================================================================

# Find an available port starting from 8080
find_available_port() {
  local port=8080
  while lsof -i:"$port" >/dev/null 2>&1 || nc -z localhost "$port" 2>/dev/null; do
    port=$((port + 1))
    if [[ $port -gt 9000 ]]; then
      echo "ERROR: Could not find available port in range 8080-9000" >&2
      exit 1
    fi
  done
  echo "$port"
}

# Generate a unique project name from the git branch
generate_project_name() {
  local branch
  branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "local")
  # Sanitize: lowercase, replace non-alphanumeric with dash, limit length
  echo "openmrs-e2e-$(echo "$branch" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | cut -c1-40)"
}

# Wait for the gateway container to be running
wait_for_gateway() {
  local max_attempts=30
  local attempt=0
  echo "Waiting for gateway container to start..."
  while ! docker compose -p "$project_name" -f "$compose_file" ps --status running --services 2>/dev/null | grep -q "^gateway$"; do
    attempt=$((attempt + 1))
    if [[ $attempt -ge $max_attempts ]]; then
      echo "ERROR: Gateway container failed to start within 60 seconds"
      echo "Container status:"
      docker compose -p "$project_name" -f "$compose_file" ps
      echo "Gateway logs:"
      docker compose -p "$project_name" -f "$compose_file" logs gateway
      exit 1
    fi
    sleep 2
  done
  echo "Gateway container is running!"
}

# Wait for the backend to be ready
wait_for_backend() {
  local url="$1"
  local max_attempts=60
  local attempt=0
  echo "Waiting for backend to be ready at $url..."
  while ! curl -sf "$url/login.htm" >/dev/null 2>&1; do
    attempt=$((attempt + 1))
    if [[ $attempt -ge $max_attempts ]]; then
      echo "ERROR: Backend failed to start within 5 minutes"
      exit 1
    fi
    echo "  Attempt $attempt/$max_attempts - waiting 5 seconds..."
    sleep 5
  done
  echo "Backend is ready!"
}

# ============================================================================
# Main Script
# ============================================================================

# Generate unique identifiers for this run
project_name=$(generate_project_name)
export E2E_PORT=$(find_available_port)
base_url="http://localhost:$E2E_PORT/openmrs"

echo "========================================"
echo "OpenMRS E2E Test Runner"
echo "========================================"
echo "Project name: $project_name"
echo "Port: $E2E_PORT"
echo "Base URL: $base_url"
echo "Keep on failure: $keep_on_failure"
echo "========================================"

# Create a temporary working directory
working_dir=$(mktemp -d "${TMPDIR:-/tmp/}openmrs-e2e-frontends.XXXXXXXXXX")
echo "Working directory: $working_dir"

# Store paths for cleanup
compose_file="$working_dir/docker-compose.yml"

# ============================================================================
# Cleanup Handler
# ============================================================================

test_exit_code=0

cleanup() {
  local cleanup_exit_code=$test_exit_code

  # If we're in CI mode, don't clean up (CI handles its own cleanup)
  if [[ "${CI:-}" == "true" || "${GITHUB_ACTIONS:-}" == "true" ]]; then
    echo "CI environment detected - skipping cleanup"
    return
  fi

  # If keep_on_failure is true and tests failed, don't clean up
  if [[ "$keep_on_failure" == "true" && $cleanup_exit_code -ne 0 ]]; then
    echo ""
    echo "========================================"
    echo "Tests failed. Keeping containers running for debugging."
    echo "========================================"
    echo "Base URL: $base_url"
    echo ""
    echo "To stop containers manually:"
    echo "  docker compose -p $project_name -f $compose_file down -v"
    echo ""
    echo "To view logs:"
    echo "  docker compose -p $project_name -f $compose_file logs -f"
    echo "========================================"
    return
  fi

  echo ""
  echo "Stopping Docker containers..."
  docker compose -p "$project_name" -f "$compose_file" down -v 2>/dev/null || true
  echo "Cleanup complete."
}

# Set up trap for cleanup on exit, interrupt, or termination
trap cleanup EXIT

# ============================================================================
# Build Frontend
# ============================================================================

# Get a list of all the apps in this workspace
apps=$(yarn workspaces list --json | jq -r 'if .location | test("-app$") then .name else empty end')
# This array will hold all of the packed app names
app_names=()

echo ""
echo "Creating packed archives of apps..."
# For each app
for app in $apps
do
  # @openmrs/esm-whatever -> _openmrs_esm_whatever
  app_name=$(echo "$app" | tr '[:punct:]' '_');
  # Add to our array
  app_names+=("$app_name.tgz");
  # Run yarn pack for our app and add it to the working directory
  yarn workspace "$app" pack -o "$working_dir/$app_name.tgz" >/dev/null;
done;
echo "Created packed app archives"

echo "Creating dynamic spa-assemble-config.json..."
# Dynamically assemble our list of frontend modules, prepending the
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

# ============================================================================
# Start Docker Containers
# ============================================================================

cd "$working_dir"
echo ""
echo "Building and starting Docker containers..."
# CACHE_BUST to ensure the assemble step is always run
docker compose -p "$project_name" build --build-arg CACHE_BUST=$(date +%s) frontend
docker compose -p "$project_name" up -d

# ============================================================================
# Wait for backend to be ready
# ============================================================================

# Wait for gateway container to be running before starting the backend timeout
wait_for_gateway

# Wait for backend to be ready
wait_for_backend "$base_url"

# ============================================================================
# CI Mode: Exit here, let CI handle tests separately
# ============================================================================

if [[ "${CI:-}" == "true" || "${GITHUB_ACTIONS:-}" == "true" ]]; then
  echo ""
  echo "CI environment detected - backend ready, exiting for CI to run tests"
  echo "Base URL: $base_url"
  # Export environment variables for GitHub Actions
  if [[ -n "${GITHUB_ENV:-}" ]]; then
    echo "E2E_BASE_URL=$base_url" >> "$GITHUB_ENV"
    echo "E2E_PORT=$E2E_PORT" >> "$GITHUB_ENV"
  fi
  exit 0
fi

# ============================================================================
# Local Mode: Run tests
# ============================================================================

# Copy environment variables if .env doesn't exist
cd "$repository_root"
if [[ ! -f .env ]]; then
  echo "Copying example.env to .env..."
  cp example.env .env
fi

echo ""
echo "========================================"
echo "Running Playwright tests..."
echo "========================================"

# Build environment variables for test run
test_env="E2E_BASE_URL=$base_url"
if [[ "$use_list_reporter" == "true" ]]; then
  test_env="$test_env E2E_REPORTER=list"
fi

# Run tests with the correct base URL
set +e  # Don't exit on test failure
env $test_env yarn playwright test ${playwright_args[@]+"${playwright_args[@]}"}
test_exit_code=$?
set -e

if [[ $test_exit_code -eq 0 ]]; then
  echo ""
  echo "========================================"
  echo "All tests passed!"
  echo "========================================"
else
  echo ""
  echo "========================================"
  echo "Tests failed with exit code: $test_exit_code"
  echo "========================================"
fi

# Exit with the test exit code (cleanup will run via trap)
exit $test_exit_code

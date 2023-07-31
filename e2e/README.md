# E2E Tests

This directory contains an E2E test suite using the [Playwright](https://playwright.dev)
framework. 

## Getting Started

Please ensure that you have followed the basic installation guide in the
[root README](../README.md).
Once everything is set up, make sure the dev server is running by using:

```sh
yarn start --sources 'packages/esm-*-app/'
```
Then, in a separate terminal, run:

```sh
yarn test-e2e --headed
```

By default, the test suite will run against the http://localhost:8080.
You can override this by exporting `E2E_BASE_URL` environment variables beforehand:

```sh
# Ex: Set the server URL to dev3:
export E2E_BASE_URL=https://dev3.openmrs.org/openmrs

# Run all e2e tests:
yarn test-e2e --headed
```
To run a specific test by title:
```sh
yarn test-e2e --headed -g "title of the test"
```
Check [this documentation](https://playwright.dev/docs/running-tests#command-line) for more running options.  

It is also highly recommended to install the companion VS Code extension:
https://playwright.dev/docs/getting-started-vscode


## Writing New Tests

In general, it is recommended to read through the official [Playwright docs](https://playwright.dev/docs/intro)
before writing new test cases. The project uses the official Playwright test runner and,
generally, follows a very simple project structure:

```
e2e
|__ commands
|   ^ Contains "commands" (simple reusable functions) that can be used in test cases/specs,
|     e.g. generate a random patient.
|__ core
|   ^ Contains code related to the test runner itself, e.g. setting up the custom fixtures.
|     You probably need to touch this infrequently.
|__ fixtures
|   ^ Contains fixtures (https://playwright.dev/docs/test-fixtures) which are used
|     to run reusable setup/teardown tasks
|__ pages
|   ^ Contains page object model classes for interacting with the frontend.
|     See https://playwright.dev/docs/test-pom for details.
|__ specs
|   ^ Contains the actual test cases/specs. New tests should be placed in this folder.
|__ support
    ^ Contains support files that requires to run e2e tests, e.g. docker compose files. 
```

When you want to write a new test case, start by creating a new spec in `./specs`.
Depending on what you want to achieve, you might want to create new fixtures and/or
page object models. To see examples, have a look at the existing code to see how these
different concepts play together.

## Open reports from GitHub Actions / Bamboo

To download the report from the GitHub action/Bamboo plan, follow these steps:

1. Go to the artifact section of the action/plan and locate the report file.
2. Download the report file and unzip it using a tool of your choice.
3. Open the index.html file in a web browser to view the report. 

The report will show you a full summary of your tests, including information on which 
tests passed, failed, were skipped, or were flaky. You can filter the report by browser 
and explore the details of individual tests, including any errors or failures, video 
recordings, and the steps involved in each test. Simply click on a test to view its details.

## Debugging Tests

Refer to [this documentation](https://playwright.dev/docs/debug) on how to debug a test.

## Configuration

This is very much underdeveloped/WIP. At the moment, there exists a (git-shared) `.env`
file which can be used for configuring certain test attributes. This is most likely
about to change in the future. Stay tuned for updates!


## Github Action integration
The e2e.yml workflow is made up of two jobs: one for running on pull requests (PRs) and
one for running on commits.

1. When running on PRs, the workflow will start the dev server, use dev3.openmrs.org as the backend, 
and run tests only on chromium. This is done in order to quickly provide feedback to the developer. 
The tests are designed to generate their own data and clean up after themselves once they are finished. 
This ensures that the tests will have minimum effect from changes made to dev3 by other developers. 
In the future, we plan to use a docker container to run the tests in an isolated environment once we 
figure out a way to spin up the container within a small amount of time.
2. When running on commits, the workflow will spin up a docker container and run the dev server against
it in order to provide a known and isolated environment. In addition, tests will be run on multiple 
browsers (chromium, firefox, and WebKit) to ensure compatibility.

## Troubleshooting tips

On MacOS, you might run into the following error:
```browserType.launch: Executable doesn't exist at /Users/<user>/Library/Caches/ms-playwright/chromium-1015/chrome-mac/Chromium.app/Contents/MacOS/Chromium```
In order to fix this, you can attempt to force the browser reinstallation by running:
```PLAYWRIGHT_BROWSERS_PATH=/Users/$USER/Library/Caches/ms-playwright npx playwright install```

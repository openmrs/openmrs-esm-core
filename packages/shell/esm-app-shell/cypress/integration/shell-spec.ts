/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe("App Shell", () => {
  it("runs without crashing", () => {
    cy.visit("localhost:9080/openmrs/spa/test");
  });

  it.only("loads a page", () => {
    cy.intercept("/openmrs/spa/other/importmap.json", {
      body: {
        imports: {
          "@openmrs/esm-test-page-1-app":
            "/openmrs/spa/@openmrs/esm-app-shell-cypress-fixtures.js",
          // "@openmrs/esm-test-page-1-app": "/openmrs/spa/helloWorldPage.js"
        },
      },
    });
    cy.intercept("openmrs/spa/*/*.js", (req) => {
      // cy.intercept('openmrs/spa/*.js', (req) => {
      console.log("initial", req.url);
      if (!req.url.endsWith("openmrs.js")) {
        req.url = req.url.replace("9080/openmrs/spa", "9081");
        console.log("url", req.url);
      }
    });
    cy.visit("localhost:9080/openmrs/spa/test");
    cy.get("body").should("have.text", "Hello world");
  });
});

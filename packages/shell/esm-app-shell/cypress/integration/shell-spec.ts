/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

function useAsIndexFile(filename: string) {
  return cy.readFile(`cypress/fixtures/src/${filename}`).then((file) => {
    cy.writeFile("cypress/fixtures/src/index.tsx", file);
  });
}

describe("App Shell", () => {
  it("loads a page", () => {
    useAsIndexFile("simplePage.tsx");
    cy.intercept("/openmrs/spa/other/importmap.json", {
      body: {
        imports: {
          "@openmrs/esm-test-app-1":
            "//localhost:9081/openmrs-esm-app-shell-cypress-fixtures.js",
        },
      },
    });
    // cy.intercept("openmrs/spa/*/*.js", (req) => {
    //   console.log("initial", req.url);
    //   if (!req.url.endsWith("openmrs.js")) {
    //     req.url = req.url.replace("9080/openmrs/spa", "9081");
    //     console.log("url", req.url);
    //   }
    // });
    cy.visit("localhost:9080/openmrs/spa/test");
    cy.get("div#test").should("have.text", "Hello world");
  });

  it("loads a page with an extension", () => {
    useAsIndexFile("pageWithExtension.tsx");
    cy.intercept("/openmrs/spa/other/importmap.json", {
      body: {
        imports: {
          "@openmrs/esm-test-app-2":
            "//localhost:9081/openmrs-esm-app-shell-cypress-fixtures.js",
        },
      },
    });
    // cy.intercept("openmrs/spa/*/*.js", (req) => {
    //   // cy.intercept('openmrs/spa/*.js', (req) => {
    //   console.log("initial", req.url);
    //   if (!req.url.endsWith("openmrs.js")) {
    //     req.url = req.url.replace("9080/openmrs/spa", "9081");
    //     console.log("url", req.url);
    //   }
    // });
    cy.visit("localhost:9080/openmrs/spa/test");
    cy.get("div#test").should("have.text", "hey worldo");
  });
});

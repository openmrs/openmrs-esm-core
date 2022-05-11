/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

function useAsIndexFile(filename: string) {
  return cy.readFile(`cypress/fixtures/src/${filename}`).then((file) => {
    cy.writeFile("cypress/fixtures/src/index.tsx", file);
  });
}

describe("App Shell", () => {
  before(() => {
    cy.intercept("/openmrs/spa/other/importmap.json", {
      body: {
        imports: {
          "@openmrs/esm-test-app":
            "//localhost:9081/openmrs-esm-app-shell-cypress-fixtures.js",
        },
      },
    });
  });

  it("loads a page", () => {
    useAsIndexFile("simplePage.tsx");
    cy.visit("localhost:9080/openmrs/spa/test");
    cy.get("div#test").should("have.text", "Hello world");
  });

  it("loads a page with an extension", () => {
    useAsIndexFile("pageWithExtension.tsx");
    cy.visit("localhost:9080/openmrs/spa/test");
    cy.get("div#test").should("have.text", "hey worldo");
  });
});

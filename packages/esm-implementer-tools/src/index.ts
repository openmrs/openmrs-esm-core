function setupOpenMRS() {
  return {
    lifecycle: () => import("./openmrs-esm-implementer-tools"),
    activate: () => true,
  };
}

const importTranslation = () => Promise.resolve();

export { setupOpenMRS, importTranslation };

export { default as ConfigEditButton } from "./config-edit-button/config-edit-button.component";

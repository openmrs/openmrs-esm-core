declare global {
  interface Window {
    spaEnv: "production" | "development" | "test";
  }
}

function setupOpenMRS() {
  return {
    lifecycle: () => import("./openmrs-esm-devtools"),
    activate: () =>
      window.spaEnv === "development" ||
      !!localStorage.getItem("openmrs:devtools"),
  };
}

const importTranslation = () => Promise.resolve();

export { importTranslation, setupOpenMRS };

import { createGlobalStore } from "./openmrs-esm-state.mock";

export const configInternalStore = createGlobalStore("config-internal", {
  devDefaultsAreOn: false,
});

export const implementerToolsConfigStore = createGlobalStore(
  "implementer-tools-config",
  {}
);

export const temporaryConfigStore = createGlobalStore("temporary-config", {});

export enum Type {
  Array = "Array",
  Boolean = "Boolean",
  ConceptUuid = "ConceptUuid",
  Number = "Number",
  Object = "Object",
  String = "String",
  UUID = "UUID",
}

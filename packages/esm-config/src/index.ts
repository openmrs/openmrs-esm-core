export * from "./module-config/module-config";
export { useConfig } from "./react-hook/use-config";
export { useExtensionConfig } from "./react-hook/use-extension-config";
export * from "./navigation/navigate";
export * from "./navigation/react-configurable-link";
export * from "./navigation/interpolate-string";
export * from "./validators/validator";
export * from "./validators/validators";

// compatibility hack for old versions of react-root-decorator
export { ModuleNameContext } from "@openmrs/esm-core-context";

import "import-map-overrides/dist/import-map-overrides";
import "systemjs/dist/system";
import "systemjs/dist/extras/amd";
import "systemjs/dist/extras/named-exports";
import "systemjs/dist/extras/named-register";
import "systemjs/dist/extras/use-default";

/**
 * Loads all provided modules by their name. Performs a
 * SystemJS import.
 * @param modules The names of the modules to resolve.
 */
export function loadModules(modules: Array<string>) {
  return Promise.all(
    modules.map((name) =>
      System.import(name).then((value): [string, System.Module] => [
        name,
        value,
      ])
    )
  );
}

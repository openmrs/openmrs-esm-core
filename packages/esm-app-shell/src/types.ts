export interface Activator {
  (location: Location): boolean;
}

export type ActivatorDefinition = Activator | RegExp | string;

export interface ModuleResolver {
  (): System.Module;
}

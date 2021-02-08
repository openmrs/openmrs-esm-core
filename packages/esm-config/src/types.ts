export enum Type {
  Array = "Array",
  Boolean = "Boolean",
  ConceptUuid = "ConceptUuid",
  Number = "Number",
  Object = "Object",
  String = "String",
  UUID = "UUID",
}

// Full-powered typing for Config and Schema trees depends on being able to
// have types like `string not "_default"`. There is an experimental PR
// for this feature, https://github.com/microsoft/TypeScript/pull/29317
// But it is not likely to be merged any time terribly soon. (Nov 11, 2020)
export interface ConfigSchema {
  [key: string]: ConfigSchema | ConfigValue;
  _type?: Type;
  _validators?: Array<Validator>;
  _elements?: ConfigSchema;
}

export interface Config extends Object {
  [moduleName: string]: { [key: string]: any };
}

export interface ConfigObject extends Object {
  [key: string]: any;
}

export type ConfigValue =
  | string
  | number
  | boolean
  | void
  | Array<any>
  | object;

export interface ExtensionSlotConfig {
  add?: Array<string>;
  remove?: Array<string>;
  order?: Array<string>;
  configure?: ExtensionSlotConfigureValueObject;
}

export interface ExtensionSlotConfigureValueObject {
  [key: string]: object;
}

export interface ExtensionSlotConfigObject {
  add?: Array<string>;
  remove?: Array<string>;
  order?: Array<string>;
}

export type ProvidedConfig = {
  source: string;
  config: Config;
};

export type ValidatorFunction = (value: any) => boolean;

export type Validator = (value: any) => void | string;

// Storybook-compatible mock for @openmrs/esm-config.
// Provides getConfig/useConfig that return default values, plus the Type
// enum and validators that config-schema.ts imports at definition time.

// Inlined from @openmrs/esm-config/src/types to avoid subpath export restrictions.
export enum Type {
  Array = 'Array',
  Boolean = 'Boolean',
  ConceptUuid = 'ConceptUuid',
  Number = 'Number',
  Object = 'Object',
  String = 'String',
  UUID = 'UUID',
  PersonAttributeTypeUuid = 'PersonAttributeTypeUuid',
  PatientIdentifierTypeUuid = 'PatientIdentifierTypeUuid',
}

export interface ConfigSchema {
  [key: string]: any;
}

// Inlined from @openmrs/esm-config/src/validators
export function validator(check: (val: any) => boolean, message: string) {
  return (val: any) => {
    if (!check(val)) {
      return message;
    }
  };
}

export const validators = {
  inRange: (min: number, max: number) =>
    validator((val) => val >= min && val <= max, `Must be between ${min} and ${max}`),
  isUrl: validator((val) => typeof val === 'string' && /^https?:\/\//.test(val), 'Must be a URL'),
  isUrlWithTemplateParameters: validator(() => true, ''),
  oneOf: (allowedValues: any[]) =>
    validator((val) => allowedValues.includes(val), `Must be one of: '${allowedValues.join("', '")}'`),
};

export function defineConfigSchema(_moduleName: string, _schema: any) {}
export function defineExtensionConfigSchema(_extensionName: string, _schema: any) {}
export function provide(_config: any) {}
export function clearConfigErrors() {}

// Extracts default values from a config schema object.
function extractDefaults(schema: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key of Object.keys(schema)) {
    if (key.startsWith('_')) continue;
    const value = schema[key];
    if (value && typeof value === 'object' && '_default' in value) {
      result[key] = value._default;
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = extractDefaults(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

// Lazily computed defaults from the styleguide's config schema.
let cachedDefaults: any = null;

function getDefaults() {
  if (!cachedDefaults) {
    // The config-schema module is imported at build time by Rspack, which
    // resolves @openmrs/esm-config to this mock. So by the time
    // getDefaults() runs, the schema has already been defined.
    try {
      // Dynamic import to break the circular dependency at module load time.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { esmStyleGuideSchema } = require('@openmrs/esm-styleguide/src/config-schema');
      cachedDefaults = extractDefaults(esmStyleGuideSchema);
    } catch {
      // Fallback: return sensible defaults if the schema can't be loaded.
      cachedDefaults = {
        'Brand color #1': '#005d5d',
        'Brand color #2': '#004144',
        'Brand color #3': '#007d79',
        implementationName: 'Clinic',
      };
    }
  }
  return cachedDefaults;
}

export function getConfig(_moduleName?: string): Promise<any> {
  return Promise.resolve(getDefaults());
}

export function useConfig(_options?: any) {
  return getDefaults();
}

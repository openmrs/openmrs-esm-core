import { type TOptions } from 'i18next';
import { Type, type ConfigValue, type ConfigSchema, type Validator, translateFrom } from '@openmrs/esm-framework';
import type { CustomValueType } from './value-editor';

const moduleName = '@openmrs/esm-implementer-tools-app';
const t = (key: string, fallback?: string, options?: Omit<TOptions, 'ns' | 'defaultValue'>) =>
  translateFrom(moduleName, key, fallback, options);

const validateString = (value: ConfigValue, validators: Array<Validator>) => {
  if (typeof value !== 'string') {
    return t('stringValidationMessage', 'Value must be a string');
  }
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return null;
};

const validateNumber = (value: ConfigValue, validators: Array<Validator>) => {
  if (typeof value !== 'number') {
    return t('numberValidationMessage', 'Value must be a number');
  }
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return null;
};

const validateBoolean = (value: ConfigValue, validators: Array<Validator>) => {
  if (typeof value !== 'boolean') {
    return t('booleanValidationMessage', 'Value must be a boolean');
  }
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return null;
};

const validateArray = (value: ConfigValue, validators: Array<Validator>, elementSchema?: ConfigSchema) => {
  if (!Array.isArray(value)) {
    return t('arrayValidationMessage', 'Value must be an array');
  }
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  if (elementSchema) {
    for (let i = 0; i < value.length; i++) {
      const element = value[i];
      if (elementSchema._type === Type.Object) {
        const error = validateObject(element, [], elementSchema);
        if (error) return error;
      } else {
        const elementType = elementSchema._type;
        const elementValidators = elementSchema._validators ?? [];
        const error = validateValue(element, elementType, elementValidators, elementSchema._elements);
        if (error) return error;
      }
    }
  }
  return null;
};

const validateObject = (value: ConfigValue, validators: Array<Validator>, elementSchema?: ConfigSchema) => {
  if (!elementSchema || typeof value !== 'object' || value === null || Array.isArray(value)) {
    return t('objectValidationMessage', 'Value must be an object');
  }
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  for (const key of Object.keys(elementSchema)) {
    if (key.startsWith('_')) continue;
    const propSchema = elementSchema[key];
    const propValue = value[key];
    if (typeof propSchema === 'object' && propSchema !== null && '_type' in propSchema) {
      if (propSchema._type === Type.Array) {
        const error = validateArray(propValue, propSchema._validators ?? [], propSchema._elements);
        if (error)
          return t('objectPropertyValidationMessage', 'Property {{key}}: {{error}}', {
            key,
            error,
          });
      } else {
        const propType = propSchema._type;
        const propValidators = propSchema._validators ?? [];
        const error = validateValue(propValue, propType, propValidators, propSchema._elements);
        if (error)
          return t('objectPropertyValidationMessage', 'Property {{key}}: {{error}}', {
            key,
            error,
          });
      }
    } else if (typeof propSchema === 'object' && propSchema !== null) {
      const error = validateObject(propValue, [], propSchema as ConfigSchema);
      if (error)
        return t('objectPropertyValidationMessage', 'Property {{key}}: {{error}}', {
          key,
          error,
        });
    }
  }
  return null;
};

const validateUuid = (value: ConfigValue, validators: Array<Validator>) => {
  if (
    typeof value !== 'string' ||
    !/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|[0-9A-Za-z]{11,36})$/i.test(
      value,
    )
  ) {
    return t('uuidValidationMessage', 'Value must be a valid UUID string');
  }
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return null;
};

export const validateValue = (
  value: ConfigValue,
  fieldType: Type | CustomValueType | undefined,
  validators: Array<Validator>,
  elementSchema?: ConfigSchema,
) => {
  switch (fieldType) {
    case Type.String:
      return validateString(value, validators);
    case Type.Number:
      return validateNumber(value, validators);
    case Type.Boolean:
      return validateBoolean(value, validators);
    case Type.Array:
      return validateArray(value, validators, elementSchema);
    case Type.Object:
      return validateObject(value, validators, elementSchema);
    case Type.UUID || Type.ConceptUuid || Type.PersonAttributeTypeUuid || Type.PatientIdentifierTypeUuid:
      return validateUuid(value, validators);
    default:
      return null;
  }
};

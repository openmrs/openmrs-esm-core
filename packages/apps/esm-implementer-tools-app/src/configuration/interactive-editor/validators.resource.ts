import { Type, validator } from '@openmrs/esm-framework';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const validateString = (value, validators) => {
  if (typeof value !== 'string') {
    return 'Value must be a string';
  }
  for (const v of validators) {
    const result = v(value);
    if (result) return result;
  }
  return null;
};

const validateNumber = (value, validators) => {
  if (typeof value !== 'number') {
    return 'Value must be a number';
  }
  for (const v of validators) {
    const result = v(value);
    if (result) return result;
  }
  return null;
};

const validateBoolean = (value, validators) => {
  if (typeof value !== 'boolean') {
    return 'Value must be a boolean';
  }
  for (const v of validators) {
    const result = v(value);
    if (result) return result;
  }
  return null;
};

const validateArray = (value, validators) => {
  if (!Array.isArray(value)) {
    return 'Value must be an array';
  }
  for (const v of validators) {
    const result = v(value);
    if (result) return result;
  }
  return null;
};

const validateObject = (value, validators) => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return 'Value must be an object';
  }
  for (const v of validators) {
    const result = v(value);
    if (result) return result;
  }
  return null;
};

const validateUuid = (value, validators) => {
  if (typeof value !== 'string' || !UUID_REGEX.test(value)) {
    return 'Value must be a valid UUID string';
  }
  for (const v of validators) {
    const result = v(value);
    if (result) return result;
  }
  return null;
};

const validateConceptUuid = (value, validators) => {
  return validateUuid(value, validators);
};

const validatePersonAttributeTypeUuid = (value, validators) => {
  return validateUuid(value, validators);
};

export const validateValue = (tmpValue, valueType, validators) => {
  switch (valueType) {
    case Type.String:
      return validateString(tmpValue, validators);
    case Type.Number:
      return validateNumber(tmpValue, validators);
    case Type.Boolean:
      return validateBoolean(tmpValue, validators);
    case Type.Array:
      return validateArray(tmpValue, validators);
    case Type.Object:
      return validateObject(tmpValue, validators);
    case Type.UUID:
      return validateUuid(tmpValue, validators);
    case Type.ConceptUuid:
      return validateConceptUuid(tmpValue, validators);
    case Type.PersonAttributeTypeUuid:
      return validatePersonAttributeTypeUuid(tmpValue, validators);
    default:
      return null;
  }
};

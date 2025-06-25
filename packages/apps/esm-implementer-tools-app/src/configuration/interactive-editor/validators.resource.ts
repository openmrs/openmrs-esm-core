import { Type } from '@openmrs/esm-framework';

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

const validateArray = (value, validators, elementSchema) => {
  if (!Array.isArray(value)) {
    return 'Value must be an array';
  }
  for (const v of validators) {
    const result = v(value);
    if (result) return result;
  }
  if (elementSchema) {
    for (let i = 0; i < value.length; i++) {
      const element = value[i];
      if (elementSchema._type === Type.Object) {
        const err = validateObject(element, [], elementSchema);
        if (err) return err;
      } else {
        const elementType = elementSchema._type;
        const elementValidators = elementSchema._validators ?? [];
        const err = validateValue(element, elementType, elementValidators, elementSchema._elements);
        if (err) return err;
      }
    }
  }
  return null;
};

const validateObject = (value, validators, schema) => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return 'Value must be an object';
  }
  for (const v of validators) {
    const result = v(value);
    if (result) return result;
  }
  for (const key of Object.keys(schema)) {
    if (key.startsWith('_')) continue;
    const propSchema = schema[key];
    const propValue = value[key];
    if (propSchema._type) {
      if (propSchema._type === Type.Array) {
        const err = validateArray(propValue, propSchema._validators ?? [], propSchema._elements);
        if (err) return `Property '${key}': ${err}`;
      } else {
        const propType = propSchema._type;
        const propValidators = propSchema._validators ?? [];
        const err = validateValue(propValue, propType, propValidators, propSchema._elements);
        if (err) return `Property '${key}': ${err}`;
      }
    } else {
      const err = validateObject(propValue, [], propSchema);
      if (err) return `Property '${key}': ${err}`;
    }
  }
  return null;
};

const validateUuid = (value, validators) => {
  if (typeof value !== 'string' || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
    return 'Value must be a valid UUID string';
  }
  for (const v of validators) {
    const result = v(value);
    if (result) return result;
  }
  return null;
};

export const validateValue = (tmpValue, valueType, validators, elementSchema = undefined) => {
  switch (valueType) {
    case Type.String:
      return validateString(tmpValue, validators);
    case Type.Number:
      return validateNumber(tmpValue, validators);
    case Type.Boolean:
      return validateBoolean(tmpValue, validators);
    case Type.Array:
      return validateArray(tmpValue, validators, elementSchema);
    case Type.Object:
      return validateObject(tmpValue, validators, elementSchema);
    case Type.UUID:
      return validateUuid(tmpValue, validators);
    case Type.ConceptUuid:
      return validateUuid(tmpValue, validators);
    case Type.PersonAttributeTypeUuid:
      return validateUuid(tmpValue, validators);
    case Type.PatientIdentifierTypeUuid:
      return validateUuid(tmpValue, validators);
    default:
      return null;
  }
};

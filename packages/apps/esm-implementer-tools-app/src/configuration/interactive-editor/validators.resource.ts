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

// For arrays, _elements is the schema for each element
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
      const el = value[i];
      // If _type: Type.Object, schema is the elementSchema itself
      if (elementSchema._type === Type.Object) {
        const err = validateObject(el, [], elementSchema);
        if (err) return `Element ${i}: ${err}`;
      } else {
        const elType = elementSchema._type;
        const elValidators = elementSchema._validators ?? [];
        const err = validateValue(el, elType, elValidators, elementSchema._elements);
        if (err) return `Element ${i}: ${err}`;
      }
    }
  }
  return null;
};

// For objects, schema is the object itself (no _type: Type.Object, no _properties)
const validateObject = (value, validators, schema) => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return 'Value must be an object';
  }
  for (const v of validators) {
    const result = v(value);
    if (result) return result;
  }
  // Validate each property in the schema (skip keys starting with _)
  for (const key of Object.keys(schema)) {
    if (key.startsWith('_')) continue;
    const propSchema = schema[key];
    const propValue = value[key];
    // If property is an object (no _type, no _validators), treat as nested object
    if (propSchema._type === Type.Object) {
      const err = validateObject(propValue, [], propSchema);
      if (err) return `Property '${key}': ${err}`;
    } else if (propSchema._type === Type.Array) {
      const err = validateArray(propValue, propSchema._validators ?? [], propSchema._elements);
      if (err) return `Property '${key}': ${err}`;
    } else {
      const propType = propSchema._type;
      const propValidators = propSchema._validators ?? [];
      const err = validateValue(propValue, propType, propValidators, propSchema._elements);
      if (err) return `Property '${key}': ${err}`;
    }
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
      return validateConceptUuid(tmpValue, validators);
    case Type.PersonAttributeTypeUuid:
      return validatePersonAttributeTypeUuid(tmpValue, validators);
    default:
      return null;
  }
};

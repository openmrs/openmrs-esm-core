import React, { useState } from 'react';
import uniqueId from 'lodash-es/uniqueId';
import { Checkbox, NumberInput, TextInput } from '@carbon/react';
import { Type } from '@openmrs/esm-framework';
import type { ConfigValueDescriptor } from '../editable-value.component';
import type { ValueType } from '../value-editor';
import { ArrayEditor } from './array-editor';
import { ConceptSearchBox } from './concept-search';
import { ExtensionSlotAdd } from './extension-slot-add';
import { ExtensionSlotRemove } from './extension-slot-remove';
import { ObjectEditor } from './object-editor';
import { ExtensionSlotOrder } from './extension-slot-order';
import { PersonAttributeTypeSearchBox } from './person-attribute-search';
import { PatientIdentifierTypeSearchBox } from './patient-identifier-type-search';

export interface ValueEditorFieldProps {
  element: ConfigValueDescriptor;
  path?: Array<string>;
  valueType?: ValueType;
  value: any;
  onChange: (value: any) => void;
  error?: string | null;
}

export function ValueEditorField({ element, path, valueType, value, onChange, error }: ValueEditorFieldProps) {
  const [id] = useState(uniqueId('value-editor-'));

  if (valueType === 'remove' && !path) {
    throw new Error("Programming error: ValueEditorField initialized for a 'remove' field, but no 'path' is available");
  }

  return valueType === Type.Array ? (
    <ArrayEditor element={element} valueArray={value} setValue={onChange} />
  ) : valueType === Type.Boolean ? (
    <Checkbox
      id={id}
      checked={value}
      hideLabel
      labelText=""
      onChange={(event, { checked, id }) => onChange(checked)}
      invalid={Boolean(error)}
      invalidText={error}
    />
  ) : valueType === Type.ConceptUuid ? (
    <ConceptSearchBox value={value} setConcept={(concept) => onChange(concept.uuid)} />
  ) : valueType === Type.PersonAttributeTypeUuid ? (
    <PersonAttributeTypeSearchBox
      value={value}
      setPersonAttributeUuid={(personAttributeTypeUuid) => onChange(personAttributeTypeUuid)}
    />
  ) : valueType === Type.PatientIdentifierTypeUuid ? (
    <PatientIdentifierTypeSearchBox value={value} setPatientIdentifierTypeUuid={(uuid) => onChange(uuid)} />
  ) : valueType === Type.Number ? (
    <NumberInput
      id={id}
      value={value}
      onChange={(_, { value }) => onChange(value ? (typeof value === 'string' ? parseInt(value) : value) : 0)}
      hideSteppers
      invalid={Boolean(error)}
      invalidText={error}
    />
  ) : valueType === Type.String || valueType === Type.UUID ? (
    <TextInput
      id={id}
      value={value}
      labelText=""
      onChange={(e) => onChange(e.target.value)}
      invalid={Boolean(error)}
      invalidText={error}
    />
  ) : valueType === 'add' ? (
    <ExtensionSlotAdd value={value ?? element._value} setValue={onChange} />
  ) : valueType === 'remove' && path ? (
    <ExtensionSlotRemove
      slotName={path[2]}
      slotModuleName={path[0]}
      value={value ?? element._value}
      setValue={onChange}
    />
  ) : valueType === 'order' && path ? (
    <ExtensionSlotOrder
      slotName={path[2]}
      slotModuleName={path[0]}
      value={value ?? element._value}
      setValue={onChange}
    />
  ) : valueType === 'configure' && path ? (
    <>Todo</>
  ) : (
    <ObjectEditor element={element} valueObject={value} setValue={onChange} />
  );
}

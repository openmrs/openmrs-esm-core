import React, { useState } from "react";
import { Checkbox, NumberInput, TextInput } from "carbon-components-react";
import { uniqueId } from "lodash-es";
import { Type } from "@openmrs/esm-config";
import { ConfigValueDescriptor } from "../editable-value.component";
import { ValueType } from "../value-editor";
import { ArrayEditor } from "./array-editor";
import { ConceptSearchBox } from "./concept-search";
import { ExtensionSlotAdd } from "./extension-slot-add";
import { ExtensionSlotRemove } from "./extension-slot-remove";
import { ObjectEditor } from "./object-editor";

export interface ValueEditorFieldProps {
  element: ConfigValueDescriptor;
  path?: String[];
  valueType?: ValueType;
  value: any;
  onChange: (value: any) => void;
}

export function ValueEditorField({
  element,
  path,
  valueType,
  value,
  onChange,
}: ValueEditorFieldProps) {
  const [id] = useState(uniqueId("value-editor-"));

  if (valueType === "remove" && !path) {
    throw new Error(
      "Programming error: ValueEditorField initialized for a 'remove' field, but no 'path' is available"
    );
  }

  return valueType === Type.Array ? (
    <ArrayEditor element={element} valueArray={value} setValue={onChange} />
  ) : valueType === Type.Boolean ? (
    <Checkbox
      id={id}
      checked={value}
      hideLabel
      labelText=""
      onChange={onChange}
    ></Checkbox>
  ) : valueType === Type.ConceptUuid ? (
    <ConceptSearchBox setConcept={(concept) => onChange(concept.uuid)} />
  ) : valueType === Type.Number ? (
    <NumberInput
      id={id}
      value={value}
      onChange={
        // e.target.value not working properly right now: https://github.com/carbon-design-system/carbon/issues/7457
        (e) => onChange(Number((e as any).imaginaryTarget.value))
      }
    ></NumberInput>
  ) : valueType === Type.String || valueType === Type.UUID ? (
    <TextInput
      id={id}
      value={value}
      labelText=""
      onChange={(e) => onChange(e.target.value)}
    ></TextInput>
  ) : valueType === "add" ? (
    <ExtensionSlotAdd
      value={value ?? element._value}
      setValue={(value) => {
        onChange(value);
      }}
    />
  ) : valueType === "remove" && path ? (
    <ExtensionSlotRemove
      slotName={path[2]}
      slotModuleName={path[0]}
      value={value ?? element._value}
      setValue={(value) => {
        onChange(value);
      }}
    />
  ) : (
    <ObjectEditor element={element} valueObject={value} setValue={onChange} />
  );
}

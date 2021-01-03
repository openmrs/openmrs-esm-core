import React, { useState, useEffect } from "react";
import {
  Button,
  StructuredListBody,
  StructuredListCell,
  StructuredListRow,
  StructuredListWrapper,
  Tile,
} from "carbon-components-react";
import { Add16, TrashCan16 } from "@carbon/icons-react";
import { ValueEditorField } from "./value-editor-field";
import { ConfigValueDescriptor } from "../editable-value.component";
import { Type } from "@openmrs/esm-config";
import { cloneDeep } from "lodash-es";
import styles from "./object-editor.styles.css";

interface ObjectEditorProps {
  element: ConfigValueDescriptor;
  valueObject: Object;
  setValue: (value: Object) => void;
}

export function ObjectEditor({
  element,
  valueObject,
  setValue,
}: ObjectEditorProps) {
  return (
    <Tile className={styles.objectEditor}>
      <StructuredListWrapper>
        <StructuredListBody>
          {Object.entries(element).map(([key, schema]) =>
            !key.startsWith("_") ? (
              <StructuredListRow>
                <StructuredListCell>
                  <ValueEditorField
                    element={{ _value: key, _source: element._source }}
                    valueType={Type.String}
                    value={key}
                    onChange={(newKey) => {
                      const newValueObject = cloneDeep(valueObject);
                      newValueObject[newKey] = cloneDeep(valueObject[key]);
                      delete newValueObject[key];
                      setValue(newValueObject);
                    }}
                  />
                </StructuredListCell>
                <StructuredListCell>
                  <ValueEditorField
                    element={{
                      ...schema,
                      _value: valueObject[key],
                      _source: element._source,
                    }}
                    valueType={schema._type}
                    value={valueObject[key]}
                    onChange={(newValue) => {
                      const newValueObject = cloneDeep(valueObject);
                      newValueObject[key] = newValue;
                      setValue(newValueObject);
                    }}
                  />
                </StructuredListCell>
              </StructuredListRow>
            ) : null
          )}
        </StructuredListBody>
      </StructuredListWrapper>
    </Tile>
  );
}

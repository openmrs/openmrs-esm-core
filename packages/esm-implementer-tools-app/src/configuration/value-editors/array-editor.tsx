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
import styles from "./array-editor.styles.css";

interface ArrayEditorProps {
  element: ConfigValueDescriptor;
  valueArray: Array<any>;
  setValue: (value: Array<any>) => void;
}

export function ArrayEditor({
  element,
  valueArray,
  setValue,
}: ArrayEditorProps) {
  return (
    <Tile className={styles.arrayEditor}>
      <StructuredListWrapper>
        <StructuredListBody>
          {valueArray.map((value, i) => (
            <StructuredListRow>
              <StructuredListCell>
                <ValueEditorField
                  element={{ _value: value, _source: "idk", _default: "" }}
                  valueType={(element._elements?._type as Type) ?? Type.Object}
                  value={value}
                  onChange={(newValue) => {
                    const newValueArray = cloneDeep(valueArray);
                    newValueArray[i] = newValue;
                    setValue(newValueArray);
                  }}
                />
              </StructuredListCell>
              <StructuredListCell>
                <Button
                  renderIcon={TrashCan16}
                  size="small"
                  kind="secondary"
                  iconDescription="Remove"
                  hasIconOnly
                  onClick={() => {
                    const newValueArray = cloneDeep(valueArray);
                    newValueArray.splice(i);
                    setValue(newValueArray);
                    return null;
                  }}
                />
              </StructuredListCell>
            </StructuredListRow>
          ))}
          <StructuredListRow>
            <StructuredListCell className={styles.addButtonCell}>
              <Button
                renderIcon={Add16}
                size="small"
                iconDescription="Add"
                hasIconOnly
                onClick={() => {
                  const newValueArray = cloneDeep(valueArray);
                  newValueArray.push(null);
                  setValue(newValueArray);
                }}
              />
            </StructuredListCell>
          </StructuredListRow>
        </StructuredListBody>
      </StructuredListWrapper>
    </Tile>
  );
}

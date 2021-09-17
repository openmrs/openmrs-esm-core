import React, { useMemo } from "react";
import cloneDeep from "lodash-es/cloneDeep";
import uniqueId from "lodash-es/uniqueId";
import Add16 from "@carbon/icons-react/es/add/16";
import TrashCan16 from "@carbon/icons-react/es/trash-can/16";
import styles from "./array-editor.styles.css";
import { Type } from "@openmrs/esm-framework";
import {
  Button,
  Tile,
  StructuredListBody,
  StructuredListCell,
  StructuredListRow,
  StructuredListWrapper,
} from "carbon-components-react";
import { ValueEditorField } from "./value-editor-field";
import { ConfigValueDescriptor } from "../editable-value.component";

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
  const arrayKey = useMemo(() => uniqueId("array-editor-"), []);
  return (
    <Tile className={styles.arrayEditor}>
      <StructuredListWrapper>
        <StructuredListBody>
          {valueArray.map((value, i) => (
            <StructuredListRow key={`${arrayKey}-${i}`}>
              <StructuredListCell>
                <ValueEditorField
                  element={{
                    ...element._elements,
                    _value: value,
                    _source: element._source,
                  }}
                  valueType={(element._elements?._type as Type) ?? Type.Object}
                  value={value}
                  onChange={(newValue) => {
                    const newValueArray = cloneDeep(valueArray);
                    newValueArray[i] = newValue;
                    setValue(newValueArray);
                  }}
                />
              </StructuredListCell>
              <StructuredListCell className={styles.buttonCell}>
                <Button
                  renderIcon={TrashCan16}
                  size="sm"
                  kind="secondary"
                  iconDescription="Remove"
                  hasIconOnly
                  onClick={() => {
                    const newValueArray = cloneDeep(valueArray);
                    newValueArray.splice(i, 1);
                    setValue(newValueArray);
                  }}
                />
              </StructuredListCell>
            </StructuredListRow>
          ))}
          <StructuredListRow>
            <StructuredListCell></StructuredListCell>
            <StructuredListCell className={styles.buttonCell}>
              <Button
                renderIcon={Add16}
                size="sm"
                iconDescription="Add"
                hasIconOnly
                onClick={() => {
                  const newValueArray = cloneDeep(valueArray);
                  const newValue =
                    (element._elements?._type ?? Type.Object) == Type.Object
                      ? {}
                      : null;
                  newValueArray.push(newValue);
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

import React, { useMemo } from 'react';
import cloneDeep from 'lodash-es/cloneDeep';
import uniqueId from 'lodash-es/uniqueId';
import { AddIcon, TrashCanIcon, Type } from '@openmrs/esm-framework';
import {
  Button,
  Tile,
  StructuredListBody,
  StructuredListCell,
  StructuredListRow,
  StructuredListWrapper,
} from '@carbon/react';
import { ValueEditorField } from './value-editor-field';
import type { ConfigValueDescriptor } from '../editable-value.component';
import styles from './array-editor.styles.scss';

interface ArrayEditorProps {
  element: ConfigValueDescriptor;
  valueArray: Array<any>;
  setValue: (value: Array<any>) => void;
}

export function ArrayEditor({ element, valueArray, setValue }: ArrayEditorProps) {
  const arrayKey = useMemo(() => uniqueId('array-editor-'), []);
  const currentValueArray = valueArray ?? [];
  return (
    <Tile className={styles.arrayEditor}>
      <StructuredListWrapper>
        <StructuredListBody>
          {currentValueArray.map((value, i) => (
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
                    const newValueArray = cloneDeep(currentValueArray);
                    newValueArray[i] = newValue;
                    setValue(newValueArray);
                  }}
                />
              </StructuredListCell>
              <StructuredListCell className={styles.buttonCell}>
                <Button
                  renderIcon={(props) => <TrashCanIcon {...props} size={16} />}
                  size="sm"
                  kind="secondary"
                  iconDescription="Remove"
                  hasIconOnly
                  onClick={() => {
                    const newValueArray = cloneDeep(currentValueArray);
                    newValueArray.splice(i, 1);
                    setValue(newValueArray);
                  }}
                />
              </StructuredListCell>
            </StructuredListRow>
          ))}
          <StructuredListRow>
            <StructuredListCell>
              <Button
                renderIcon={(props) => <AddIcon {...props} size={16} />}
                size="sm"
                iconDescription="Add"
                hasIconOnly
                onClick={() => {
                  const newValueArray = cloneDeep(currentValueArray);
                  const newValue = (element._elements?._type ?? Type.Object) == Type.Object ? {} : null;
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

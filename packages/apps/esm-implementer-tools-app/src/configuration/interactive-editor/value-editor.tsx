import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import { CloseIcon, SaveIcon, Type } from '@openmrs/esm-framework';
import type { ConfigValueDescriptor } from './editable-value.component';
import { ValueEditorField } from './value-editors/value-editor-field';
import styles from './value-editor.scss';
import { validateValue } from './validators.resource';

export type CustomValueType = 'add' | 'remove' | 'order' | 'configure';

export type ValueType = CustomValueType | Type;

interface ValueEditorProps {
  element: ConfigValueDescriptor;
  customType?: CustomValueType;
  path: Array<string>;
  handleSave: (val: string) => void;
  handleClose: () => void;
}

export function ValueEditor({ element, customType, path, handleSave, handleClose }: ValueEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tmpValue, setTmpValue] = useState(element._value);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const valueType = customType ?? element._type;
  const validators = element._validators ?? [];

  let elementSchema: any = undefined;
  if (valueType === (Type as any).Object) {
    elementSchema = element;
  } else if (valueType === (Type as any).Array) {
    elementSchema = element._elements;
  }

  const handleSaveClick = useCallback(() => {
    const errorMessage = validateValue(tmpValue, valueType, validators, elementSchema);
    if (errorMessage) {
      setError(errorMessage);
    } else {
      setError(null);
      handleSave(JSON.stringify(tmpValue));
    }
  }, [tmpValue, valueType, validators, handleSave, elementSchema]);

  useEffect(() => {
    const keyListener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'Enter') {
        handleSaveClick();
      }
    };

    document.addEventListener('keyup', keyListener);
    return () => {
      document.removeEventListener('keyup', keyListener);
    };
  }, [handleClose, handleSaveClick]);

  return (
    <div ref={ref} style={{ display: 'inherit' }}>
      <ValueEditorField element={element} path={path} value={tmpValue} onChange={setTmpValue} valueType={valueType} />
      {error && <div className={styles.errorMessage}>{error}</div>}
      <div className={styles.valueEditorButtons}>
        <Button renderIcon={(props) => <SaveIcon {...props} size={16} />} kind="primary" onClick={handleSaveClick}>
          {t('saveValueButtonText', 'Save')}
        </Button>
        <Button renderIcon={(props) => <CloseIcon {...props} size={16} />} kind="secondary" onClick={handleClose}>
          {t('cancelButtonText', 'Cancel')}
        </Button>
      </div>
    </div>
  );
}

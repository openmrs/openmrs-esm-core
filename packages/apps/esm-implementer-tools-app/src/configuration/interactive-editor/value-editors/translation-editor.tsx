import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Button, ComboBox, TextInput, Layer } from '@carbon/react';
import { Add, TrashCan } from '@carbon/react/icons';
import styles from '../value-editor.styles.scss';

interface TranslationEditorProps {
  value: Record<string, string> | undefined;
  setValue: (value: Record<string, string>) => void;
  path?: string[];
}

interface Translation {
  key: string;
  currentValue: string;
}

interface TranslationOverride extends Translation {
  overrideValue: string;
}

export function TranslationEditor({ value, setValue, path }: TranslationEditorProps) {
  const [newTranslation, setNewTranslation] = useState({
    inputValue: '',
    overrideValue: '',
    selectedTranslation: null as Translation | null,
  });

  // Get module name from path
  const moduleName = path?.[0] || 'unknown-module';

  // Extract clean overrides - value should already be a simple object
  const cleanOverrides = useMemo(() => {
    if (!value || typeof value !== 'object') {
      return {};
    }

    // Filter out any metadata keys and ensure string values
    const result: Record<string, string> = {};
    Object.entries(value).forEach(([key, val]) => {
      if (!key.startsWith('_') && typeof val === 'string') {
        result[key] = val;
      }
    });

    return result;
  }, [value]);

  // Get all available translations for this module as array of objects
  const availableTranslations = useMemo<Translation[]>(() => {
    const translations = window.i18next.store.data.en[moduleName] || {};

    return Object.entries(translations).map(([key, val]) => ({
      key,
      currentValue: String(val || key),
    }));
  }, [moduleName]);

  // Create translation overrides as array of objects
  const translationOverrides = useMemo<TranslationOverride[]>(() => {
    return Object.entries(cleanOverrides).map(([key, overrideValue]) => {
      const translation = availableTranslations.find((t) => t.key === key);
      return {
        key,
        currentValue: translation?.currentValue || key,
        overrideValue,
      };
    });
  }, [cleanOverrides, availableTranslations]);

  // Create filtering function for ComboBox - simple and fast
  const shouldFilterItem = useCallback(
    ({ item, inputValue }: { item: Translation; inputValue: string | null }) => {
      if (!inputValue?.trim()) {
        // Show first 50 items when no search term to avoid overwhelming the dropdown
        const itemIndex = availableTranslations.indexOf(item);
        return itemIndex < 50;
      }

      const searchTerm = inputValue.toLowerCase().trim();
      const currentValueLower = item.currentValue.toLowerCase();

      // Match if search term is found in the display value or at word boundaries
      return (
        currentValueLower.includes(searchTerm) ||
        currentValueLower.split(' ').some((word) => word.startsWith(searchTerm))
      );
    },
    [availableTranslations],
  );

  // Safe setValue that ensures we always pass clean string objects
  const safeSetValue = useCallback(
    (newOverrides: Record<string, string>) => {
      // Create a clean object with only non-empty string values
      const cleanObject: Record<string, string> = {};
      Object.entries(newOverrides).forEach(([key, val]) => {
        if (typeof val === 'string' && val.trim()) {
          cleanObject[key] = val.trim();
        }
      });
      setValue(cleanObject);
    },
    [setValue],
  );

  const handleAdd = useCallback(() => {
    if (!newTranslation.inputValue.trim() || !newTranslation.overrideValue.trim()) return;

    // Don't allow override if the value is the same as current value
    if (newTranslation.inputValue.trim() === newTranslation.overrideValue.trim()) return;

    // Use selectedTranslation if available, otherwise fall back to searching
    let translationKey: string | undefined;

    if (newTranslation.selectedTranslation) {
      translationKey = newTranslation.selectedTranslation.key;
    } else {
      // Fallback: search for the translation key that corresponds to the input value
      const translation = availableTranslations.find((t) => t.currentValue === newTranslation.inputValue.trim());
      translationKey = translation?.key;
    }

    if (translationKey) {
      const newOverrides = {
        ...cleanOverrides,
        [translationKey]: newTranslation.overrideValue.trim(),
      };

      safeSetValue(newOverrides);
      setNewTranslation({
        inputValue: '',
        overrideValue: '',
        selectedTranslation: null,
      });
    }
  }, [newTranslation, cleanOverrides, availableTranslations, safeSetValue]);

  const handleEdit = useCallback(
    (key: string, newVal: string) => {
      const newOverrides = { ...cleanOverrides };

      if (newVal) {
        newOverrides[key] = newVal; // Don't trim while editing, allow spaces
      } else {
        delete newOverrides[key]; // Remove empty values
      }

      // Don't use safeSetValue here as it trims - save the raw value while editing
      setValue(newOverrides);
    },
    [cleanOverrides, setValue],
  );

  const handleRemove = useCallback(
    (key: string) => {
      const newOverrides = { ...cleanOverrides };
      delete newOverrides[key];
      safeSetValue(newOverrides);
    },
    [cleanOverrides, safeSetValue],
  );

  return (
    <div className={styles.valueEditorContainer}>
      <div className={styles.translationOverrideSection}>
        {/* Existing overrides */}
        {translationOverrides.map(({ key, currentValue, overrideValue }) => (
          <Layer key={key} className={styles.arrayEditorRow}>
            <div className={styles.translationOverrideRow}>
              <TextInput id={`key-${key}`} value={currentValue} readOnly labelText="Current Value" />
              <TextInput
                id={`value-${key}`}
                value={overrideValue}
                onChange={(e) => handleEdit(key, e.target.value)}
                labelText="Override Value"
              />
              <Button
                kind="ghost"
                size="sm"
                hasIconOnly
                renderIcon={TrashCan}
                iconDescription="Remove override"
                onClick={() => handleRemove(key)}
              />
            </div>
          </Layer>
        ))}

        {/* Add new override */}
        <Layer className={styles.arrayEditorRow}>
          <div className={styles.translationOverrideRow}>
            <ComboBox
              id="new-value"
              items={availableTranslations}
              selectedItem={newTranslation.selectedTranslation}
              itemToString={(item) => (item ? item.currentValue : newTranslation.inputValue)}
              onInputChange={(inputValue) => {
                setNewTranslation((prev) => ({
                  ...prev,
                  inputValue,
                  // Clear selection if user types something different
                  selectedTranslation:
                    prev.selectedTranslation && inputValue !== prev.selectedTranslation.currentValue
                      ? null
                      : prev.selectedTranslation,
                }));
              }}
              onChange={({ selectedItem }) => {
                if (selectedItem) {
                  setNewTranslation((prev) => ({
                    ...prev,
                    inputValue: selectedItem.currentValue,
                    selectedTranslation: selectedItem,
                    // Auto-fill the selected value as starting point for override
                    overrideValue: prev.overrideValue || selectedItem.currentValue,
                  }));
                } else {
                  setNewTranslation((prev) => ({
                    ...prev,
                    selectedTranslation: null,
                  }));
                }
              }}
              placeholder="Select translation to override"
              titleText="Current value"
              allowCustomValue
              shouldFilterItem={shouldFilterItem}
            />
            <TextInput
              id="new-override-value"
              value={newTranslation.overrideValue}
              onChange={(e) =>
                setNewTranslation((prev) => ({
                  ...prev,
                  overrideValue: e.target.value,
                }))
              }
              placeholder="Override value"
              labelText="Override Value"
            />
            <Button
              kind="primary"
              size="sm"
              hasIconOnly
              renderIcon={Add}
              iconDescription="Add override"
              onClick={handleAdd}
              disabled={
                !newTranslation.inputValue.trim() ||
                !newTranslation.overrideValue.trim() ||
                newTranslation.inputValue.trim() === newTranslation.overrideValue.trim()
              }
            />
          </div>
        </Layer>
      </div>
    </div>
  );
}

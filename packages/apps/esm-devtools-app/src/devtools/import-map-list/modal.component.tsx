import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  addRoutesOverride,
  removeRoutesOverride,
} from "@openmrs/esm-framework/src/internal";
import {
  Button,
  Form,
  ModalHeader,
  ModalBody,
  ModalFooter,
  TextInput,
} from "@carbon/react";
import { Module } from "./types";

type ImportMapModalProps = (
  | { module: Module; isNew: false }
  | { module: never; isNew: true }
) & { close: () => void };

const ImportMapModal: React.FC<ImportMapModalProps> = ({
  module,
  isNew,
  close,
}) => {
  const { t } = useTranslation();
  const [moduleName, setModuleName] = useState<string | undefined>(
    module?.moduleName
  );
  const moduleNameRef = useRef<HTMLInputElement>();
  const inputRef = useRef<HTMLInputElement>();
  const handleSubmit = useCallback(
    (evt: Event) => {
      evt.preventDefault();

      if (!moduleName) {
        return;
      }

      if (window.importMapOverrides.isDisabled(moduleName)) {
        window.importMapOverrides.enableOverride(moduleName);
      }

      if (isNew) {
        const newUrl = inputRef.current.value || null;
        if (newUrl) {
          window.importMapOverrides.addOverride(moduleName, newUrl);
          const baseUrl = newUrl.substring(0, newUrl.lastIndexOf("/"));
          addRoutesOverride(moduleName, new URL("routes.json", baseUrl));
        }
      } else {
        const newUrl = inputRef.current.value || null;
        if (newUrl === null) {
          window.importMapOverrides.removeOverride(moduleName);
          removeRoutesOverride(moduleName);
        } else {
          window.importMapOverrides.addOverride(moduleName, newUrl);
          const baseUrl = newUrl.substring(0, newUrl.lastIndexOf("/"));
          addRoutesOverride(moduleName, new URL("routes.json", baseUrl));
        }
      }

      close();
    },
    [moduleName, isNew, close]
  );

  useEffect(
    () => (isNew ? moduleNameRef.current?.focus() : inputRef.current?.focus()),
    // Only fired on initial mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <>
      <ModalHeader
        title={
          isNew
            ? t("addModule", "Add Module")
            : t("editModule", "Edit Module {{- moduleName}}", {
                moduleName: moduleName,
              })
        }
      />
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          {isNew && (
            <TextInput
              id="module-name"
              ref={moduleNameRef}
              onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                evt.preventDefault();
                setModuleName(evt.target.value);
              }}
              labelText={t("moduleName", "Module Name")}
            />
          )}
          {!isNew && (
            <TextInput
              id="default-url"
              labelText={t("defaultUrl", "Default URL")}
              value={module.defaultUrl}
              readOnly
            />
          )}
          <TextInput
            id="override-url"
            ref={inputRef}
            labelText={t("overrideUrl", "Override URL")}
          />
        </ModalBody>
        <ModalFooter>
          <Button kind="secondary" onClick={close}>
            {t("cancel", "Cancel")}
          </Button>
          <Button type="submit">{t("apply", "Apply")}</Button>
        </ModalFooter>
      </Form>
    </>
  );
};

export default ImportMapModal;

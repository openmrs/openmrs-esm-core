import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./change-locale.scss";
import { Select, SelectItem } from "@carbon/react";
import {
  ExtensionSlot,
  useConnectivity,
  useSession,
} from "@openmrs/esm-framework";
import {
  PostSessionLocale,
  PostUserProperties,
  postUserPropertiesOnline,
  postUserPropertiesOffline,
  postSessionLocaleOnline,
  postSessionLocaleOffline,
} from "./change-locale.resource";
import { useTranslation } from "react-i18next";

export interface ChangeLocaleProps {
  postUserProperties: PostUserProperties;
  postSessionLocale: PostSessionLocale;
}

const ChangeLocaleWrapper: React.FC<{}> = () => {
  const isOnline = useConnectivity();
  const [postUserProperties, postSessionLocale] = useMemo(
    () =>
      isOnline
        ? [postUserPropertiesOnline, postSessionLocaleOnline]
        : [postUserPropertiesOffline, postSessionLocaleOffline],
    [isOnline]
  );

  return <ChangeLocale {...{ postUserProperties, postSessionLocale }} />;
};

// exported for tests
export const ChangeLocale: React.FC<ChangeLocaleProps> = ({
  postUserProperties,
  postSessionLocale,
}) => {
  const { t } = useTranslation();
  const { user, locale, allowedLocales } = useSession();
  const [selectedLocale, setSelectedLocale] = useState(
    user?.userProperties?.defaultLocale ?? locale
  );
  const options = allowedLocales?.map((locale) => (
    <SelectItem text={locale} value={locale} key={locale} />
  ));

  useEffect(() => {
    if (user.userProperties.defaultLocale !== selectedLocale) {
      const ac = new AbortController();
      postUserProperties(
        user.uuid,
        {
          ...(user.userProperties ?? {}),
          defaultLocale: selectedLocale,
        },
        ac
      );
      postSessionLocale(selectedLocale, ac);
      return () => ac.abort();
    }
  }, [selectedLocale, postUserProperties, user, postSessionLocale]);

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) =>
      setSelectedLocale(event.target.value),
    [setSelectedLocale]
  );

  const onClick = useCallback(
    (event: React.SyntheticEvent) => event.stopPropagation(),
    []
  );

  return (
    <div className={`omrs-margin-12 ${styles.switcherContainer}`}>
      <Select
        name="selectLocale"
        id="selectLocale"
        invalidText="A valid locale value is required"
        labelText={t("selectLocale", "Select locale")}
        onChange={onChange}
        onClick={onClick}
        value={selectedLocale}
      >
        {options}
      </Select>
      <ExtensionSlot name="user-panel-actions-slot" />
    </div>
  );
};

export default ChangeLocaleWrapper;

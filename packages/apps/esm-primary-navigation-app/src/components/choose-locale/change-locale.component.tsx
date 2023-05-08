import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./change-locale.scss";
import { Select, SelectItem } from "@carbon/react";
import {
  ExtensionSlot,
  LoggedInUser,
  useConnectivity,
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
  allowedLocales: Array<string>;
  user: LoggedInUser;
  postUserProperties: PostUserProperties;
  postSessionLocale: PostSessionLocale;
}

const ChangeLocaleWrapper: React.FC<
  Pick<ChangeLocaleProps, "allowedLocales" | "user">
> = (props) => {
  const isOnline = useConnectivity();
  const [postUserProperties, postSessionLocale] = useMemo(
    () =>
      isOnline
        ? [postUserPropertiesOnline, postSessionLocaleOnline]
        : [postUserPropertiesOffline, postSessionLocaleOffline],
    [isOnline]
  );

  return (
    <ChangeLocale {...props} {...{ postUserProperties, postSessionLocale }} />
  );
};

// exported for tests
export const ChangeLocale: React.FC<ChangeLocaleProps> = ({
  allowedLocales,
  user,
  postUserProperties,
  postSessionLocale,
}) => {
  const { t } = useTranslation();
  const [userProps, setUserProps] = useState(user.userProperties);
  const options = allowedLocales?.map((locale) => (
    <SelectItem text={locale} value={locale} key={locale} />
  ));

  useEffect(() => {
    if (user.userProperties.defaultLocale !== userProps.defaultLocale) {
      const ac = new AbortController();
      postUserProperties(user.uuid, userProps, ac);
      postSessionLocale(userProps.defaultLocale, ac);
      return () => ac.abort();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProps, postUserProperties, postSessionLocale]);

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) =>
      setUserProps({ ...userProps, defaultLocale: event.target.value }),
    [userProps, setUserProps]
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
        value={userProps.defaultLocale}
      >
        {options}
      </Select>
      <ExtensionSlot name="user-panel-actions-slot" />
    </div>
  );
};

export default ChangeLocaleWrapper;

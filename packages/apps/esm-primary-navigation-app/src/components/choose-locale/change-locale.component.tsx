import React, { useEffect, useState } from "react";
import styles from "./change-locale.scss";
import { Select, SelectItem } from "@carbon/react";
import { ExtensionSlot, LoggedInUser } from "@openmrs/esm-framework";
import {
  PostSessionLocale,
  PostUserProperties,
} from "./change-locale.resource";
import { useTranslation } from "react-i18next";

export interface ChangeLocaleProps {
  allowedLocales: Array<string>;
  user: LoggedInUser;
  postUserProperties: PostUserProperties;
  postSessionLocale: PostSessionLocale;
}

const ChangeLocale: React.FC<ChangeLocaleProps> = ({
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

  return (
    <div className={`omrs-margin-12 ${styles.switcherContainer}`}>
      <Select
        name="selectLocale"
        id="selectLocale"
        invalidText="A valid locale value is required"
        labelText={t("selectLocale", "Select locale")}
        onChange={(event) =>
          setUserProps({ ...userProps, defaultLocale: event.target.value })
        }
        onClick={(event) => event.stopPropagation()}
        value={userProps.defaultLocale}
      >
        {options}
      </Select>
      <ExtensionSlot name="user-panel-actions-slot" />
    </div>
  );
};

export default ChangeLocale;

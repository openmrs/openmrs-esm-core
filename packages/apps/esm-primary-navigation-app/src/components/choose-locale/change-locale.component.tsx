import React, { useEffect, useState } from "react";
import styles from "./change-locale.component.scss";
import { Select, SelectItem } from "carbon-components-react";
import { LoggedInUser } from "@openmrs/esm-framework";
import { PostUserProperties } from "./change-locale.resource";

export interface ChangeLocaleProps {
  allowedLocales: Array<string>;
  user: LoggedInUser;
  postUserProperties: PostUserProperties;
}

const ChangeLocale: React.FC<ChangeLocaleProps> = ({
  allowedLocales,
  user,
  postUserProperties,
}) => {
  const [userProps, setUserProps] = useState(user.userProperties);
  const options = allowedLocales?.map((locale) => (
    <SelectItem text={locale} value={locale} key={locale} />
  ));

  useEffect(() => {
    if (user.userProperties.defaultLocale !== userProps.defaultLocale) {
      const ac = new AbortController();
      postUserProperties(user.uuid, userProps, ac);
      return () => ac.abort();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProps]);

  return (
    <div className={`omrs-margin-12 ${styles.labelselect}`}>
      <Select
        name="selectLocale"
        id="selectLocale"
        invalidText="A valid value locale is required"
        labelText="Select locale"
        onChange={(event) =>
          setUserProps({ ...userProps, defaultLocale: event.target.value })
        }
        onClick={(event) => event.stopPropagation()}
        value={userProps.defaultLocale}
      >
        {options}
      </Select>
    </div>
  );
};

export default ChangeLocale;

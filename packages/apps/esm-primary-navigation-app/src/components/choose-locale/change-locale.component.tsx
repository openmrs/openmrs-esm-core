import React, { useCallback, useEffect, useState } from "react";
import Select from "carbon-components-react/es/components/Select";
import SelectItem from "carbon-components-react/es/components/SelectItem";
import styles from "./change-locale.component.scss";
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
  const selectLocale = useCallback(
    (event) =>
      setUserProps((props) => ({
        ...props,
        defaultLocale: event.target.value,
      })),
    []
  );

  useEffect(() => {
    if (user.userProperties.defaultLocale !== userProps.defaultLocale) {
      postUserProperties(userProps);
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
        onChange={selectLocale}
        value={userProps.defaultLocale}
      >
        {options}
      </Select>
    </div>
  );
};

export default ChangeLocale;

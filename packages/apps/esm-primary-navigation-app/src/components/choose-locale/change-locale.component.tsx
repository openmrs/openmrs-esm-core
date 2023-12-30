import React, { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Select, SelectItem } from '@carbon/react';
import type { LoggedInUser } from '@openmrs/esm-framework';
import { ExtensionSlot, useConnectivity } from '@openmrs/esm-framework';
import type { PostUserProperties } from './change-locale.resource';
import { postUserPropertiesOnline, postUserPropertiesOffline } from './change-locale.resource';
import styles from './change-locale.scss';

export interface ChangeLocaleProps {
  allowedLocales: Array<string>;
  user: LoggedInUser;
  locale: string;
  postUserProperties: PostUserProperties;
}

const ChangeLocaleWrapper: React.FC<Pick<ChangeLocaleProps, 'allowedLocales' | 'user' | 'locale'>> = (props) => {
  const isOnline = useConnectivity();
  const postUserProperties = useMemo(
    () => (isOnline ? postUserPropertiesOnline : postUserPropertiesOffline),
    [isOnline],
  );

  return <ChangeLocale {...props} postUserProperties={postUserProperties} />;
};

// exported for tests
export const ChangeLocale: React.FC<ChangeLocaleProps> = ({ allowedLocales, locale, user, postUserProperties }) => {
  const { t } = useTranslation();
  const [selectedLocale, setSelectedLocale] = useState(locale);
  const options = allowedLocales?.map((locale) => <SelectItem text={locale} value={locale} key={locale} />);

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newLocale = event.target.value;
      if (newLocale !== selectedLocale) {
        const ac = new AbortController();
        postUserProperties(
          user.uuid,
          {
            ...(user.userProperties ?? {}),
            defaultLocale: newLocale,
          },
          ac,
        );
        setSelectedLocale(newLocale);
      }
    },
    [postUserProperties, user.userProperties, user.uuid, selectedLocale],
  );

  const onClick = useCallback((event: React.SyntheticEvent) => event.stopPropagation(), []);

  return (
    <div className={classNames('omrs-margin-12', styles.switcherContainer)}>
      <Select
        name="selectLocale"
        id="selectLocale"
        invalidText="A valid locale value is required"
        labelText={t('selectLocale', 'Select locale')}
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

import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserActivity } from '@carbon/react/icons';
import { useSession } from '@openmrs/esm-framework';
import { navigate } from '@openmrs/esm-framework/src/internal';
import './user-activity.extension.scss';

const UserActivityIcon: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useSession();

  const handleClick = () => {
    navigate({ to: '/openmrs/spa/user-activity' });
  };

  return (
    <div className="user-activity-icon-container">
      <UserActivity
        size={20}
        onClick={handleClick}
        aria-label={t('userActivity', 'User Activity')}
        title={t('userActivity', 'User Activity')}
        className="user-activity-icon"
      />
    </div>
  );
};

export default UserActivityIcon;

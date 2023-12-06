import React from 'react';
import { ConnectionSignalOff } from '@carbon/react/icons';
import { subscribeConnectivity } from '@openmrs/esm-framework';
import styles from './offline-banner.scss';

export interface OfflineBannerProps {}

const OfflineBanner: React.FC<OfflineBannerProps> = () => {
  const lastUpdated = useLastUpdated();

  return (
    <aside className={styles.offlineBanner}>
      <div className={styles.offlineIconContainer}>
        <ConnectionSignalOff size={16} />
      </div>
      <span className={styles.offlineNote}>Offline</span>
      <div className={styles.offlineLastUpdatedContainer}>
        <span className={styles.lastUpdatedNote}>Last updated:&nbsp;</span>
        <span>{formatLastUpdated(lastUpdated)}</span>
      </div>
    </aside>
  );
};

function formatLastUpdated(lastUpdated: Date) {
  const date = lastUpdated.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const time = lastUpdated.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${date} @ ${time}`;
}

function useLastUpdated() {
  const [lastUpdated, setLastUpdated] = React.useState(new Date());

  const readAndSetLastUpdated = () => {
    const value = localStorage.getItem('offline-last-updated');
    const date = value ? new Date(value) : new Date();
    setLastUpdated(date);
  };

  const writeLastUpdated = (date = new Date()) => {
    localStorage.setItem('offline-last-updated', date.toISOString());
  };

  React.useEffect(() => {
    let wasOnline: boolean | null = null;

    return subscribeConnectivity(({ online }) => {
      if (!online && wasOnline) {
        writeLastUpdated();
      }

      wasOnline = online;
      readAndSetLastUpdated();
    });
  }, []);

  return lastUpdated;
}

export default OfflineBanner;

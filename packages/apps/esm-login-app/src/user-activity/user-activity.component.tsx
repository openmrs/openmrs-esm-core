import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tile,
  Tab,
  Tabs,
  Tag,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  InlineLoading,
} from '@carbon/react';
import { useSession } from '@openmrs/esm-framework';
import { getUserLoginHistory, getSecurityStatus, type LoginActivity } from './user-activity.resource';
import styles from './user-activity.scss';

const UserActivity: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useSession();
  const [activeTab, setActiveTab] = useState(0);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [loginHistory, setLoginHistory] = useState<LoginActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (user?.uuid) {
          const history = await getUserLoginHistory(user.uuid);
          setLoginHistory(history);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.uuid]);

  const isAdmin = user?.roles?.some((role) => role.display === 'System Administrator');

  const headers = [
    { key: 'timestamp', header: t('timestamp', 'Timestamp') },
    { key: 'status', header: t('status', 'Status') },
    { key: 'ipAddress', header: t('ipAddress', 'IP Address') },
    { key: 'deviceInfo', header: t('deviceInfo', 'Device Info') },
  ];

  const getStatusTag = (status: string) => {
    return status === 'success' ? (
      <Tag type="green">{t('success', 'Success')}</Tag>
    ) : (
      <Tag type="red">{t('failed', 'Failed')}</Tag>
    );
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Tile className={styles.activityCard}>
          <InlineLoading description={t('loading', 'Loading...')} />
        </Tile>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Tile className={styles.activityCard}>
          <div className={styles.errorMessage}>
            {t('errorLoadingData', 'Error loading data')}: {error}
          </div>
        </Tile>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Tile className={styles.activityCard}>
        <h2>{t('userActivity', 'User Activity Dashboard')}</h2>

        <Tabs selectedIndex={activeTab} onChange={setActiveTab}>
          <Tab label={t('loginHistory', 'Login History')}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader key={header.key}>{header.header}</TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loginHistory.map((activity, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(activity.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{getStatusTag(activity.status)}</TableCell>
                      <TableCell>{activity.ipAddress}</TableCell>
                      <TableCell>{activity.deviceInfo}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Tab>

          <Tab label={t('securityStatus', 'Security Status')}>
            <div className={styles.securityInfo}>
              <h3>{t('accountSecurity', 'Account Security')}</h3>
              <p>
                {t('lastLogin', 'Last Login')}:{' '}
                {loginHistory[0]
                  ? new Date(loginHistory[0].timestamp).toLocaleString()
                  : t('noData', 'No data available')}
              </p>
              <p>{t('activeSessions', 'Active Sessions')}: 1</p>
              <Button onClick={() => setShowSecurityModal(true)}>
                {t('viewSecurityDetails', 'View Security Details')}
              </Button>
            </div>
          </Tab>

          {isAdmin && (
            <Tab label={t('adminTools', 'Admin Tools')}>
              <div className={styles.adminTools}>
                <h3>{t('administrativeTools', 'Administrative Tools')}</h3>
                <Button>{t('exportActivityLog', 'Export Activity Log')}</Button>
                <Button>{t('viewAllSessions', 'View All Active Sessions')}</Button>
                <Button>{t('securityAlerts', 'Security Alerts')}</Button>
              </div>
            </Tab>
          )}
        </Tabs>
      </Tile>

      <Modal
        open={showSecurityModal}
        onRequestClose={() => setShowSecurityModal(false)}
        modalHeading={t('securityDetails', 'Security Details')}
      >
        <ModalBody>
          <div className={styles.securityDetails}>
            <h4>{t('currentSession', 'Current Session')}</h4>
            <p>
              {t('sessionStart', 'Session Start')}: {new Date().toLocaleString()}
            </p>
            <p>
              {t('deviceInfo', 'Device Info')}: {loginHistory[0]?.deviceInfo || t('noData', 'No data available')}
            </p>
            <p>
              {t('ipAddress', 'IP Address')}: {loginHistory[0]?.ipAddress || t('noData', 'No data available')}
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button kind="secondary" onClick={() => setShowSecurityModal(false)}>
            {t('close', 'Close')}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default UserActivity;

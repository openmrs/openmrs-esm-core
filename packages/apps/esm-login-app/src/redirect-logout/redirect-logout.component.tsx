import { useEffect } from 'react';
import { navigate, setUserLanguage, useConfig, useConnectivity, useSession } from '@openmrs/esm-framework';
import { clearHistory } from '@openmrs/esm-framework/src/internal';
import { type ConfigSchema } from '../config-schema';
import { performLogout } from './logout.resource';

const RedirectLogout: React.FC = () => {
  const config = useConfig<ConfigSchema>();
  const isLoginEnabled = useConnectivity();
  const session = useSession();

  useEffect(() => {
    clearHistory();
    if (!session.authenticated || !isLoginEnabled) {
      navigate({ to: '${openmrsSpaBase}/login' });
    } else {
      performLogout()
        .then(() => {
          const defaultLanguage = document.documentElement.getAttribute('data-default-lang');

          setUserLanguage({
            locale: defaultLanguage,
            authenticated: false,
            sessionId: '',
          });

          if (config.provider.type === 'oauth2') {
            navigate({ to: config.provider.logoutUrl });
          } else {
            navigate({ to: '${openmrsSpaBase}/login' });
          }
        })
        .catch((error) => {
          console.error('Logout failed:', error);
        });
    }
  }, [config, isLoginEnabled, session]);

  return null;
};

export default RedirectLogout;

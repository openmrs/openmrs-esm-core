import { useEffect } from 'react';
import { navigate, setUserLanguage, useConfig, useSession } from '@openmrs/esm-framework';
import { clearHistory } from '@openmrs/esm-framework/src/internal';
import { type ConfigSchema } from '../config-schema';
import { performLogout } from './logout.resource';

const RedirectLogout: React.FC = () => {
  const config = useConfig<ConfigSchema>();
  const session = useSession();

  useEffect(() => {
    clearHistory();
    if (!session.authenticated) {
      if (config.provider.type === 'custom') {
        navigate({ to: config.provider.loginUrl });
      } else if (config.provider.type === 'oauth2') {
        // do nothing, do not redirect
      } else {
        navigate({ to: '${openmrsSpaBase}/login' });
      }
    } else {
      performLogout()
        .then(() => {
          const defaultLanguage = document.documentElement.getAttribute('data-default-lang');

          setUserLanguage({
            locale: defaultLanguage,
            authenticated: false,
            sessionId: '',
          });

          if (config.provider.type === 'custom') {
            navigate({ to: config.provider.loginUrl });
          } else if (config.provider.type === 'oauth2') {
            // do nothing, do not redirect
          } else {
            navigate({ to: '${openmrsSpaBase}/login' });
          }
        })
        .catch((error) => {
          console.error('Logout failed:', error);
        });
    }
  }, [config, session]);

  return null;
};

export default RedirectLogout;

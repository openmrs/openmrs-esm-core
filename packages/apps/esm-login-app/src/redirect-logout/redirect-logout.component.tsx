import type React from 'react';
import { useEffect } from 'react';
import { navigate, setUserLanguage, useConfig, useConnectivity, useSession } from '@openmrs/esm-framework';
import { clearHistory } from '@openmrs/esm-framework/src/internal';
import { performLogout } from './logout.resource';

export interface RedirectLogoutProps {}

const RedirectLogout: React.FC<RedirectLogoutProps> = () => {
  const config = useConfig();
  const session = useSession();
  const isLoginEnabled = useConnectivity();

  useEffect(() => {
    clearHistory();
    if (!session.authenticated || !isLoginEnabled) {
      navigate({ to: '${openmrsSpaBase}/login' });
    } else {
      performLogout().then(() => {
        const defaultLang = document.documentElement.getAttribute('data-default-lang');
        setUserLanguage({
          locale: defaultLang,
          authenticated: false,
          sessionId: '',
        });
        if (config.provider.type === 'oauth2') {
          navigate({ to: config.provider.logoutUrl });
        } else {
          navigate({ to: '${openmrsSpaBase}/login' });
        }
      });
    }
  }, [isLoginEnabled, session, config]);

  return null;
};

export default RedirectLogout;

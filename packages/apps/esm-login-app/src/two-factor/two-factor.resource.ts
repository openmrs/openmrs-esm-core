import {
  useOpenmrsSWR,
  useSession,
  restBaseUrl,
  useConfig,
  openmrsFetch,
  showSnackbar,
  type Session,
  setUserLanguage,
  refetchCurrentUser,
  navigate as openmrsNavigate,
} from '@openmrs/esm-framework';
import type { ConfigSchema } from '../config-schema';
import { useMemo } from 'react';
import type { TFunction } from 'react-i18next';
import type { LoginReferrer } from '../login/login.component';
import { clearHistory } from '@openmrs/esm-framework/src/internal';
import { performLogout } from '../redirect-logout/logout.resource';

type Attribute = {
  uuid: string;
  display: string;
  attributeType: {
    uuid: string;
    display: string;
  };
  value: string;
};

type Provider = {
  uuid: string;
  display: string;
  person: {
    uuid: string;
    display: string;
    attributes: Array<Attribute>;
  };
  attributes: Array<Attribute>;
};
export const useProviderDetails = () => {
  const rep = `custom:(uuid,display,person:(uuid,display,attributes),attributes)`;
  const session = useSession();
  const { attributeTypes } = useConfig<ConfigSchema>();
  const {
    currentProvider: { uuid },
  } = session;
  const { data, error, isLoading, mutate } = useOpenmrsSWR<Provider>(`${restBaseUrl}/provider/${uuid}?v=${rep}`);
  const providerDetails = data?.data;
  const phoneNumberFromPersonAttributes = useMemo(() => {
    return providerDetails?.person?.attributes?.find(
      (attribute) => attribute.attributeType.uuid === attributeTypes.personPhoneNumber,
    )?.value;
  }, [providerDetails, attributeTypes.personPhoneNumber]);
  const phoneNumberFromProviderAttributes = useMemo(() => {
    return providerDetails?.attributes?.find(
      (attribute) => attribute.attributeType.uuid === attributeTypes.providerPhoneNumber,
    )?.value;
  }, [providerDetails, attributeTypes.providerPhoneNumber]);
  const nationalIdFromProviderAttributes = useMemo(() => {
    return providerDetails?.attributes?.find(
      (attribute) => attribute.attributeType.uuid === attributeTypes.providerNationalId,
    )?.value;
  }, [providerDetails, attributeTypes.providerNationalId]);

  return {
    nationalId: nationalIdFromProviderAttributes,
    telephone: phoneNumberFromPersonAttributes || phoneNumberFromProviderAttributes,
    name: providerDetails?.person?.display,
    isLoading,
    error,
    mutate,
  };
};

/**
 * Removes the '+' prefix from a phone number if present
 * @param phoneNumber - The phone number to sanitize
 * @returns The phone number without the '+' prefix
 */
export function sanitizePhoneNumber(phoneNumber: string): string {
  if (!phoneNumber) {
    return phoneNumber;
  }
  return phoneNumber.startsWith('+') ? phoneNumber.substring(1) : phoneNumber;
}

export const twoFactorRequired = async (t: TFunction, username: string, password: string): Promise<boolean> => {
  try {
    const url = `${restBaseUrl}/kenyaemr/requireLoginOtp`;
    let headers = {};
    if (username && password) {
      headers['Authorization'] = `Basic ${window.btoa(`${username}:${password}`)}`;
    }
    const res = await openmrsFetch<{ loginOtp: string }>(url, { headers });
    await clearCurrentUserSession();
    return res.data?.loginOtp === 'true';
  } catch (error) {
    showSnackbar({
      subtitle: error?.message,
      kind: 'error',
      title: t('twoFactorError', 'Error checking two-factor requirement'),
    });
    return false;
  }
};

export const getRedirectUrl = (
  session: Session,
  loginLinks: ConfigSchema['links'],
  location: Omit<Location, 'state'> & {
    state: LoginReferrer;
  },
) => {
  if (session.sessionLocation) {
    let to = loginLinks?.loginSuccess || '/home';
    if (location?.state?.referrer) {
      if (location.state.referrer.startsWith('/')) {
        to = `\${openmrsSpaBase}${location.state.referrer}`;
      } else {
        to = location.state.referrer;
      }
    }
    return to;
  } else {
    return '${openmrsSpaBase}/login/location';
  }
};

export const getProviderDetails = async (
  username: string,
  password: string,
  attributeTypes: ConfigSchema['attributeTypes'],
  t: TFunction,
  loginLinks: ConfigSchema['links'],
  location: Omit<Location, 'state'> & {
    state: LoginReferrer;
  },
) => {
  let headers = {};
  if (username && password) {
    headers['Authorization'] = `Basic ${window.btoa(`${username}:${password}`)}`;
  }
  try {
    const sessionResponse = await openmrsFetch<Session>(`${restBaseUrl}/session`, {
      headers,
    });
    const providerUuid = sessionResponse.data.currentProvider?.uuid;
    if (!providerUuid) {
      throw new Error('No provider associated with the current user');
    }
    const rep = `custom:(uuid,display,person:(uuid,display,attributes),attributes)`;
    const providerResponse = await openmrsFetch<Provider>(`${restBaseUrl}/provider/${providerUuid}?v=${rep}`, {
      headers,
    });
    const providerDetails = providerResponse.data;
    const phoneNumberFromPersonAttributes = providerDetails?.person?.attributes?.find(
      (attribute) => attribute.attributeType.uuid === attributeTypes.personPhoneNumber,
    )?.value;
    const phoneNumberFromProviderAttributes = providerDetails?.attributes?.find(
      (attribute) => attribute.attributeType.uuid === attributeTypes.providerPhoneNumber,
    )?.value;
    const nationalIdFromProviderAttributes = providerDetails?.attributes?.find(
      (attribute) => attribute.attributeType.uuid === attributeTypes.providerNationalId,
    )?.value;

    await clearCurrentUserSession();

    return {
      nationalId: nationalIdFromProviderAttributes,
      telephone: phoneNumberFromPersonAttributes || phoneNumberFromProviderAttributes,
      name: providerDetails?.person?.display,
      redirectUrl: getRedirectUrl(sessionResponse.data, loginLinks, location),
    };
  } catch (error) {
    showSnackbar({
      subtitle: error?.message,
      kind: 'error',
      title: t('twoFactorError', 'Error fetching provider details'),
    });
    return null;
  }
};

const clearCurrentUserSession = async () => {
  clearHistory();
  try {
    await performLogout();
    const defaultLanguage = document.documentElement.getAttribute('data-default-lang');

    setUserLanguage({
      locale: defaultLanguage,
      authenticated: false,
      sessionId: '',
    });
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

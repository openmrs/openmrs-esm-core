import { type ConfigSchema } from '../src/config-schema';

export const mockConfig: ConfigSchema = {
  provider: {
    type: 'basic',
    loginUrl: '',
    logoutUrl: '',
  },
  chooseLocation: {
    enabled: true,
    numberToShow: 3,
    useLoginLocationTag: true,
    locationsPerRequest: 50,
  },
  logo: {
    src: null,
    alt: 'Logo',
  },
  links: {
    loginSuccess: '${openmrsSpaBase}/home',
  },
  footer: {
    additionalLogos: [],
  },
  showPasswordOnSeparateScreen: true,
  background: {
    color: '',
    imageUrl: '',
  },
  layout: {
    loginFormPosition: 'center' as const,
    showFooter: true,
  },
  branding: {
    title: '',
    subtitle: '',
    helpText: '',
  },
};

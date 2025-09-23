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
  systemMessages: {
    enabled: false,
    messages: [],
  },
  background: {
    type: 'default',
    value: '',
    overlay: {
      enabled: false,
      color: 'rgba(0, 0, 0, 0.3)',
      opacity: 0.3,
    },
  },
  customContent: {
    welcome: {
      enabled: false,
      title: '',
      message: '',
      position: 'top',
    },
    disclaimer: {
      enabled: false,
      text: '',
      position: 'footer',
    },
  },
};

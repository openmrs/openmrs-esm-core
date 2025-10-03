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
    type: 'default',
    value: '',
    alt: 'Background Image',
    size: 'cover',
    position: 'center',
    repeat: 'no-repeat',
    attachment: 'scroll',
    overlay: {
      enabled: false,
      color: 'rgba(0, 0, 0, 0.3)',
      opacity: 0.3,
      blendMode: 'normal',
    },
  },
  layout: {
    type: 'default' as const,
    columnPosition: 'center' as const,
    showLogo: true,
    showFooter: true,
  },
  card: {
    backgroundColor: '',
    borderRadius: '',
    width: '',
    padding: '',
    boxShadow: '',
  },
  button: {
    backgroundColor: '',
    textColor: '',
  },
  branding: {
    title: '',
    subtitle: '',
    customText: '',
    helpText: '',
    contactEmail: '',
    customLinks: [],
  },
};

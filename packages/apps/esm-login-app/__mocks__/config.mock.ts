import { type ConfigSchema } from '../src/config-schema';

export const mockConfig: ConfigSchema = {
  announcements: [],
  background: {
    image: '',
    color: '',
  },
  provider: {
    type: 'basic',
    loginUrl: '',
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
};

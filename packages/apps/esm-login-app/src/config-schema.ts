import { validators, Type } from '@openmrs/esm-framework';

export const configSchema = {
  appVersion: {
    _type: Type.String,
    _default: '3.x',
    _description: 'Specifies the version of the configuration.',
  },
  showVersionNumber: {
    _type: Type.Boolean,
    _default: true,
    _description: 'displays version number if condition is met',
  },
  partnerLogos: {
    _type: Type.Array,
    _default: [],
    _description: 'A path or URL to an image. If null, will use the OHRI SVG sprite.',
  },
  provider: {
    type: {
      _type: Type.String,
      _default: 'basic',
      _description:
        "Selects the login mechanism to use. Choices are 'basic' and 'oauth2'. " +
        "For 'oauth2' you'll also need to set the 'loginUrl' and 'logoutUrl'.",
    },
    loginUrl: {
      _type: Type.String,
      _default: '${openmrsSpaBase}/login',
      _description: 'The URL to use for an OAuth2 login.',
      _validators: [validators.isUrl],
    },
    logoutUrl: {
      _type: Type.String,
      _default: '${openmrsSpaBase}/logout',
      _description: 'The URL to use for an OAuth2 logout.',
      _validators: [validators.isUrl],
    },
  },
  chooseLocation: {
    enabled: {
      _type: Type.Boolean,
      _default: true,
      _description:
        "Whether to show a 'Choose Location' screen after login. " +
        'If true, the user will be taken to the loginSuccess URL after they ' +
        'choose a location.',
    },
    numberToShow: {
      _type: Type.Number,
      _default: 8,
      _description: 'The number of locations displayed on location picker',
    },
    locationsPerRequest: {
      _type: Type.Number,
      _default: 50,
      _description: 'The number of results to be fetched in each cycle of the infinite scroll',
    },
    useLoginLocationTag: {
      _type: Type.Boolean,
      _default: true,
      _description: "Whether to show only locations with the 'Login Location' tag. If false, shows all locations.",
    },
  },
  links: {
    loginSuccess: {
      _type: Type.String,
      _description: 'Where to take the user after they are logged in.',
      _default: '${openmrsSpaBase}/home',
      _validators: [validators.isUrl],
    },
  },
  logo: {
    src: {
      _type: Type.String,
      _default: null,
      _description: 'A path or URL to an image. If null, will use the OpenMRS SVG sprite.',
      _validators: [validators.isUrl],
    },
    alt: {
      _type: Type.String,
      _default: 'Logo',
      _description: 'Alt text, shown on hover',
    },
  },
  showPasswordOnSeparateScreen: {
    _type: Type.Boolean,
    _default: true,
    _description:
      'Whether to show the password field on a separate screen. If false, the password field will be shown on the same screen.',
  },
};

export interface ConfigSchema {
  provider: {
    type: string;
    loginUrl: string;
    logoutUrl: string;
  };
  chooseLocation: {
    enabled: boolean;
    numberToShow: number;
    locationsPerRequest: number;
    useLoginLocationTag: boolean;
  };
  links: {
    loginSuccess: string;
  };
  logo: {
    src: string;
    alt: string;
  };
  showPasswordOnSeparateScreen: boolean;
}

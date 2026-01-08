import { validators, Type } from '@openmrs/esm-framework';

export const configSchema = {
  provider: {
    type: {
      _type: Type.String,
      _default: 'basic',
      _description:
        "Selects the login mechanism to use. Choices are 'basic' and 'oauth2'. " +
        "For 'oauth2' you'll also need to set the 'loginUrl'",
      _validators: [validators.oneOf(['basic', 'oauth2'])],
    },
    loginUrl: {
      _type: Type.String,
      _default: '${openmrsSpaBase}/login',
      _description: 'The URL to use to login. This is only needed if you are using OAuth2.',
      _validators: [validators.isUrl],
    },
    logoutUrl: {
      _type: Type.String,
      _default: '${openmrsSpaBase}/logout',
      _description: 'The URL to use to login. This is only needed if you are using OAuth2.',
      _validators: [validators.isUrl],
    },
  },
  chooseLocation: {
    enabled: {
      _type: Type.Boolean,
      _default: true,
      _description:
        "Whether to show a 'Choose Location' screen after login. " +
        "If true, the user will be taken to the URL set in the 'links.loginSuccess' config property after choosing a location.",
    },
    numberToShow: {
      _type: Type.Number,
      _default: 8,
      _description: 'The number of locations displayed in the location picker.',
      _validators: [validators.inRange(1, 100)],
    },
    locationsPerRequest: {
      _type: Type.Number,
      _default: 50,
      _description: 'The number of results to fetch in each cycle of infinite scroll.',
      _validators: [validators.inRange(1, 500)],
    },
    useLoginLocationTag: {
      _type: Type.Boolean,
      _default: true,
      _description:
        "Whether to display only locations with the 'Login Location' tag. If false, all locations are shown.",
    },
  },
  links: {
    loginSuccess: {
      _type: Type.String,
      _default: '${openmrsSpaBase}/home',
      _description: 'The URL to redirect the user to after a successful login.',
      _validators: [validators.isUrl],
    },
  },
  logo: {
    _type: Type.Object,
    _description: 'Configure the logo displayed on the login page.',
    src: {
      _type: Type.String,
      _default: '',
      _description:
        'The path or URL to the logo image. If set to an empty string, the default OpenMRS SVG sprite will be used.',
      _validators: [validators.isUrl],
    },
    alt: {
      _type: Type.String,
      _default: 'Logo',
      _description: 'The alternative text for the logo image, displayed when the image cannot be loaded or on hover.',
    },
  },
  footer: {
    _type: Type.Object,
    _description: 'Configure the footer section of the login page.',
    additionalLogos: {
      _type: Type.Array,
      _elements: {
        _type: Type.Object,
        src: {
          _type: Type.String,
          _required: true,
          _description: 'The source URL of the logo image',
          _validators: [validators.isUrl],
        },
        alt: {
          _type: Type.String,
          _required: true,
          _description: 'The alternative text for the logo image',
        },
      },
      _default: [],
      _description: 'An array of logos to be displayed in the footer next to the OpenMRS logo.',
    },
  },
  showPasswordOnSeparateScreen: {
    _type: Type.Boolean,
    _default: true,
    _description:
      'Whether to show the password field on a separate screen. If false, the password field will be shown on the same screen.',
  },
  layout: {
    _type: Type.Object,
    _description: 'Configure the position and layout of the login form on the page.',
    loginFormPosition: {
      _type: Type.String,
      _default: 'center',
      _description: 'Position of the login form on the screen.',
      _validators: [validators.oneOf(['left', 'center', 'right'])],
    },
    showFooter: {
      _type: Type.Boolean,
      _default: true,
      _description: 'Whether to show the footer on the login page.',
    },
  },
  background: {
    _type: Type.Object,
    _description: 'Configure the login page background with either a solid color or background image.',
    color: {
      _type: Type.String,
      _default: '',
      _description: 'Solid background color (e.g., "#0071C5", "blue", "rgb(0,113,197)"). Leave empty for default.',
    },
    imageUrl: {
      _type: Type.String,
      _default: '',
      _description: 'URL to background image (e.g., "https://example.com/bg.jpg"). Leave empty for no image.',
      _validators: [validators.isUrl],
    },
  },
  branding: {
    _type: Type.Object,
    _description: 'Configure custom branding text for the login page.',
    title: {
      _type: Type.String,
      _default: '',
      _description: 'Custom title text or translation key (e.g., "welcome.title").',
    },
    subtitle: {
      _type: Type.String,
      _default: '',
      _description: 'Custom subtitle text or translation key (e.g., "welcome.subtitle").',
    },
    helpText: {
      _type: Type.String,
      _default: '',
      _description: 'Custom help text or translation key for support information.',
    },
  },
};

export interface ConfigSchema {
  chooseLocation: {
    enabled: boolean;
    locationsPerRequest: number;
    numberToShow: number;
    useLoginLocationTag: boolean;
  };
  footer: {
    additionalLogos: Array<{
      alt: string;
      src: string;
    }>;
  };
  links: {
    loginSuccess: string;
  };
  logo: {
    alt: string;
    src: string;
  };
  provider: {
    loginUrl: string;
    logoutUrl: string;
    type: 'basic' | 'oauth2';
  };
  showPasswordOnSeparateScreen: boolean;
  background: {
    color: string;
    imageUrl: string;
  };
  layout: {
    loginFormPosition: 'left' | 'center' | 'right';
    showFooter: boolean;
  };
  branding: {
    title: string;
    subtitle: string;
    helpText: string;
  };
}

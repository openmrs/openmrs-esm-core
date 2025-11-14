import { validators, Type } from '@openmrs/esm-framework';

export const configSchema = {
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
        "If true, the user will be taken to the URL set in the 'links.loginSuccess' config property after choosing a location.",
    },
    numberToShow: {
      _type: Type.Number,
      _default: 8,
      _description: 'The number of locations displayed in the location picker.',
    },
    locationsPerRequest: {
      _type: Type.Number,
      _default: 50,
      _description: 'The number of results to fetch in each cycle of infinite scroll.',
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
      _description: 'The URL to redirect the user to after a successful login.',
      _default: '${openmrsSpaBase}/home',
      _validators: [validators.isUrl],
    },
  },
  logo: {
    src: {
      _type: Type.String,
      _default: null,
      _description: 'The path or URL to the logo image. If set to null, the default OpenMRS SVG sprite will be used.',
      _validators: [validators.isUrl],
    },
    alt: {
      _type: Type.String,
      _default: 'Logo',
      _description: 'The alternative text for the logo image, displayed when the image cannot be loaded or on hover.',
    },
  },
  backgroundImage: {
    src: {
      _type: Type.String,
      _default: null,
      _description: 'The path or URL to the background image. If set to null, a default background will be used.',
      _validators: [validators.isUrl],
    },
    alt: {
      _type: Type.String,
      _default: 'Background image',
      _description:
        'The alternative text for the background image, displayed when the image cannot be loaded or on hover.',
    },
  },
  badgeLogo: {
    src: {
      _type: Type.String,
      _default: null,
      _description: 'The path or URL to the badge Logo image. If set to null, a default badge logo will be used.',
      _validators: [validators.isUrl],
    },
    alt: {
      _type: Type.String,
      _default: 'Badge logo',
      _description: 'The alternative text for the badge logo, displayed when the image cannot be loaded or on hover.',
    },
  },
  footer: {
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
  attributeTypes: {
    _type: Type.Object,
    _description: 'The attribute types to use for the phone number.',
    _default: {
      personPhoneNumber: 'b2c38640-2603-4629-aebd-3b54f33f1e3a',
      providerPhoneNumber: '37daed7f-1f4e-4e62-8e83-6048ade18a87',
      providerNationalId: '3d152c97-2293-4a2b-802e-e0f1009b7b15',
    },
  },
};

export interface ConfigSchema {
  attributeTypes: {
    personPhoneNumber: string;
    providerPhoneNumber: string;
    providerNationalId: string;
  };
  provider: {
    loginUrl: string;
    logoutUrl: string;
    type: string;
  };
  chooseLocation: {
    enabled: boolean;
    locationsPerRequest: number;
    numberToShow: number;
    useLoginLocationTag: boolean;
  };
  links: {
    loginSuccess: string;
  };
  logo: {
    alt: string;
    src: string;
  };
  backgroundImage: {
    alt: string;
    src: string;
  };
  footer: {
    additionalLogos: Array<{
      alt: string;
      src: string;
    }>;
  };
  badgeLogo: {
    alt: string;
    src: string;
  };
  showPasswordOnSeparateScreen: boolean;
}

import { validators, Type, validator } from '@openmrs/esm-framework';

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
      _validators: [validator((v: unknown) => typeof v === 'number' && v > 0, 'Must be greater than zero')],
    },
    locationsPerRequest: {
      _type: Type.Number,
      _default: 50,
      _description: 'The number of results to fetch in each cycle of infinite scroll.',
      _validators: [validator((v: unknown) => typeof v === 'number' && v > 0, 'Must be greater than zero')],
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
  systemMessages: {
    enabled: {
      _type: Type.Boolean,
      _default: false,
      _description: 'Whether to enable system messages on the login page.',
    },
    messages: {
      _type: Type.Array,
      _elements: {
        _type: Type.Object,
        id: {
          _type: Type.String,
          _required: true,
          _description: 'Unique identifier for the message.',
        },
        type: {
          _type: Type.String,
          _default: 'info',
          _description: 'The type of message to display.',
          _validators: [validators.oneOf(['info', 'warning', 'error', 'success'])],
        },
        title: {
          _type: Type.String,
          _required: false,
          _description: 'The title of the message.',
        },
        content: {
          _type: Type.String,
          _required: true,
          _description: 'The content of the message. Supports HTML.',
        },
        dismissible: {
          _type: Type.Boolean,
          _default: true,
          _description: 'Whether the message can be dismissed by the user.',
        },
        showOn: {
          _type: Type.String,
          _default: 'all',
          _description: 'Which pages to show the message on.',
          _validators: [validators.oneOf(['all', 'login', 'location-picker'])],
        },
        startDate: {
          _type: Type.String,
          _required: false,
          _description: 'ISO date string for when to start showing the message.',
        },
        endDate: {
          _type: Type.String,
          _required: false,
          _description: 'ISO date string for when to stop showing the message.',
        },
      },
      _default: [],
      _description: 'An array of system messages to display on the login page.',
    },
  },
  background: {
    type: {
      _type: Type.String,
      _default: 'default',
      _description: 'The type of background to use.',
      _validators: [validators.oneOf(['default', 'color', 'image', 'gradient'])],
    },
    value: {
      _type: Type.String,
      _default: '',
      _description: 'The background value (color code, image URL, or gradient CSS).',
    },
    overlay: {
      enabled: {
        _type: Type.Boolean,
        _default: false,
        _description: 'Whether to enable an overlay on the background.',
      },
      color: {
        _type: Type.String,
        _default: 'rgba(0, 0, 0, 0.3)',
        _description: 'The overlay color.',
      },
      opacity: {
        _type: Type.Number,
        _default: 0.3,
        _description: 'The opacity of the overlay (0-1).',
        _validators: [validator((v: unknown) => typeof v === 'number' && v >= 0 && v <= 1, 'Must be between 0 and 1')],
      },
    },
  },
  customContent: {
    welcome: {
      enabled: {
        _type: Type.Boolean,
        _default: false,
        _description: 'Whether to show a welcome message.',
      },
      title: {
        _type: Type.String,
        _default: '',
        _description: 'The title of the welcome message.',
      },
      message: {
        _type: Type.String,
        _default: '',
        _description: 'The welcome message content. Supports HTML.',
      },
      position: {
        _type: Type.String,
        _default: 'top',
        _description: 'Where to position the welcome message.',
        _validators: [validators.oneOf(['top', 'bottom', 'side'])],
      },
    },
    disclaimer: {
      enabled: {
        _type: Type.Boolean,
        _default: false,
        _description: 'Whether to show a disclaimer.',
      },
      text: {
        _type: Type.String,
        _default: '',
        _description: 'The disclaimer text. Supports HTML.',
      },
      position: {
        _type: Type.String,
        _default: 'footer',
        _description: 'Where to position the disclaimer.',
        _validators: [validators.oneOf(['footer', 'sidebar'])],
      },
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
  systemMessages: {
    enabled: boolean;
    messages: Array<{
      id: string;
      type: 'info' | 'warning' | 'error' | 'success';
      title?: string;
      content: string;
      dismissible: boolean;
      showOn: 'all' | 'login' | 'location-picker';
      startDate?: string;
      endDate?: string;
    }>;
  };
  background: {
    type: 'default' | 'color' | 'image' | 'gradient';
    value: string;
    overlay: {
      enabled: boolean;
      color: string;
      opacity: number;
    };
  };
  customContent: {
    welcome: {
      enabled: boolean;
      title: string;
      message: string;
      position: 'top' | 'bottom' | 'side';
    };
    disclaimer: {
      enabled: boolean;
      text: string;
      position: 'footer' | 'sidebar';
    };
  };
}

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
  layout: {
    type: {
      _type: Type.String,
      _default: 'default',
      _description:
        'The layout type for the login page. ' +
        'default: Simple layout with optional background and card positioning. ' +
        'split-screen: Background image on one side, login card on the other side.',
      _validators: [validators.oneOf(['default', 'split-screen'])],
    },
    columnPosition: {
      _type: Type.String,
      _default: 'center',
      _description:
        'Position of the login card on the screen. ' +
        'For default layout: positions the card left/center/right on the screen. ' +
        'For split-screen layout: positions the card and shows background image on the opposite side.',
      _validators: [validators.oneOf(['left', 'center', 'right'])],
    },
    showLogo: {
      _type: Type.Boolean,
      _default: true,
      _description: 'Whether to show the logo on the login page.',
    },
    showFooter: {
      _type: Type.Boolean,
      _default: true,
      _description: 'Whether to show the footer on the login page.',
    },
  },
  card: {
    backgroundColor: {
      _type: Type.String,
      _default: '',
      _description: 'Custom background color for the login card. Leave empty to use theme default.',
    },
    borderRadius: {
      _type: Type.String,
      _default: '',
      _description: 'Custom border radius for the login card (e.g., "8px", "1rem"). Leave empty to use theme default.',
    },
    width: {
      _type: Type.String,
      _default: '',
      _description: 'Custom width for the login card (e.g., "400px", "25rem"). Leave empty to use default.',
    },
    padding: {
      _type: Type.String,
      _default: '',
      _description: 'Custom padding for the login card (e.g., "2rem", "32px"). Leave empty to use default.',
    },
    boxShadow: {
      _type: Type.String,
      _default: '',
      _description:
        'Custom box shadow for the login card (e.g., "0 4px 6px rgba(0,0,0,0.1)"). Leave empty for no shadow.',
    },
  },
  button: {
    backgroundColor: {
      _type: Type.String,
      _default: '',
      _description: 'Custom background color for the login button. Leave empty to use theme default.',
    },
    textColor: {
      _type: Type.String,
      _default: '',
      _description: 'Custom text color for the login button. Leave empty to use theme default.',
    },
  },
  branding: {
    title: {
      _type: Type.String,
      _default: '',
      _description: 'Custom title to display above the login form (e.g., "Welcome to MyClinic").',
    },
    subtitle: {
      _type: Type.String,
      _default: '',
      _description: 'Custom subtitle to display below the title.',
    },
    customText: {
      _type: Type.String,
      _default: '',
      _description:
        'Additional custom text or HTML to display on the login page. ' +
        'WARNING: HTML content is rendered as-is. Ensure you trust the source and sanitize any user-provided content to prevent XSS attacks.',
    },
    helpText: {
      _type: Type.String,
      _default: '',
      _description: 'Help text to display below the login form.',
    },
    contactEmail: {
      _type: Type.String,
      _default: '',
      _description: 'Contact email to display for support.',
    },
    customLinks: {
      _type: Type.Array,
      _elements: {
        _type: Type.Object,
        text: {
          _type: Type.String,
          _required: true,
          _description: 'The text to display for the link.',
        },
        url: {
          _type: Type.String,
          _required: true,
          _description: 'The URL the link should navigate to.',
          _validators: [validators.isUrl],
        },
      },
      _default: [],
      _description: 'Custom links to display on the login page (e.g., legacy UI, help documentation).',
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
      _description:
        'The background value based on the type. ' +
        'For color: any valid CSS color (e.g., "#0066cc", "rgb(0,102,204)", "blue"). ' +
        'For gradient: any valid CSS gradient (e.g., "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"). ' +
        'For image: a URL to the image (e.g., "https://example.com/background.jpg").',
    },
    alt: {
      _type: Type.String,
      _default: 'Background Image',
      _description: 'Alternative text for background images.',
    },
    size: {
      _type: Type.String,
      _default: 'cover',
      _description: 'Background size for image backgrounds. Options: cover, contain, auto, or custom CSS values.',
      _validators: [validators.oneOf(['cover', 'contain', 'auto'])],
    },
    position: {
      _type: Type.String,
      _default: 'center',
      _description:
        'Background position for image backgrounds. Options: center, top, bottom, left, right, or custom CSS values.',
    },
    repeat: {
      _type: Type.String,
      _default: 'no-repeat',
      _description: 'Background repeat for image backgrounds.',
      _validators: [validators.oneOf(['no-repeat', 'repeat', 'repeat-x', 'repeat-y'])],
    },
    attachment: {
      _type: Type.String,
      _default: 'scroll',
      _description: 'Background attachment for image backgrounds.',
      _validators: [validators.oneOf(['scroll', 'fixed', 'local'])],
    },
    overlay: {
      enabled: {
        _type: Type.Boolean,
        _default: false,
        _description: 'Whether to enable an overlay on the background to improve content readability.',
      },
      color: {
        _type: Type.String,
        _default: 'rgba(0, 0, 0, 0.3)',
        _description: 'The overlay color in any valid CSS color format (hex, rgb, rgba, hsl, etc.).',
      },
      opacity: {
        _type: Type.Number,
        _default: 0.3,
        _description: 'The opacity of the overlay (0-1). Lower values are more transparent.',
        _validators: [validators.inRange(0, 1)],
      },
      blendMode: {
        _type: Type.String,
        _default: 'normal',
        _description: 'CSS blend mode for the overlay.',
        _validators: [
          validators.oneOf([
            'normal',
            'multiply',
            'screen',
            'overlay',
            'darken',
            'lighten',
            'color-dodge',
            'color-burn',
            'hard-light',
            'soft-light',
            'difference',
            'exclusion',
          ]),
        ],
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
  background: {
    type: 'default' | 'color' | 'image' | 'gradient';
    value: string;
    alt: string;
    size: string;
    position: string;
    repeat: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
    attachment: 'scroll' | 'fixed' | 'local';
    overlay: {
      enabled: boolean;
      color: string;
      opacity: number;
      blendMode:
        | 'normal'
        | 'multiply'
        | 'screen'
        | 'overlay'
        | 'darken'
        | 'lighten'
        | 'color-dodge'
        | 'color-burn'
        | 'hard-light'
        | 'soft-light'
        | 'difference'
        | 'exclusion';
    };
  };
  layout: {
    type: 'default' | 'split-screen';
    columnPosition: 'left' | 'center' | 'right';
    showLogo: boolean;
    showFooter: boolean;
  };
  card: {
    backgroundColor: string;
    borderRadius: string;
    width: string;
    padding: string;
    boxShadow: string;
  };
  button: {
    backgroundColor: string;
    textColor: string;
  };
  branding: {
    title: string;
    subtitle: string;
    customText: string;
    helpText: string;
    contactEmail: string;
    customLinks: Array<{
      text: string;
      url: string;
    }>;
  };
}

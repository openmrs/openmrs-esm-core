import { validators, Type } from "@openmrs/esm-framework";

export const configSchema = {
  provider: {
    type: {
      _type: Type.String,
      _default: "basic",
      _description:
        "Selects the login mechanism to use. Choices are 'basic' and 'oauth2'. " +
        "For 'oauth2' you'll also need to set the 'loginUrl' and 'logoutUrl'.",
    },
    loginUrl: {
      _type: Type.String,
      _default: "${openmrsSpaBase}/login",
      _description: "The URL to use for an OAuth2 login.",
      _validators: [validators.isUrl],
    },
    logoutUrl: {
      _type: Type.String,
      _default: "${openmrsSpaBase}/logout",
      _description: "The URL to use for an OAuth2 logout.",
      _validators: [validators.isUrl],
    },
  },
  chooseLocation: {
    enabled: {
      _type: Type.Boolean,
      _default: true,
      _description:
        "Whether to show a 'Choose Location' screen after login. " +
        "If true, the user will be taken to the loginSuccess URL after they " +
        "choose a location.",
    },
    numberToShow: {
      _type: Type.Number,
      _default: 8,
      _description: "The number of locations displayed on location picker",
    },
    locationsPerRequest: {
      _type: Type.Number,
      _default: 50,
      _description:
        "The number of results to be fetched in each cycle of the infinite scroll",
    },
    useLoginLocationTag: {
      _type: Type.Boolean,
      _default: true,
      _description:
        "Whether to show only locations with the 'Login Location' tag. If false, shows all locations.",
    },
    saveLocationPreference: {
      allowed: {
        _type: Type.Boolean,
        _default: true,
        _description:
          "Whether to allow users to set preference for login locations for their future preference",
      },
      savePreferenceOnComputer: {
        _type: Type.Boolean,
        _default: true,
        _description: "Whether to save preference on the system only.",
      },
      savePreferenceAsUserProp: {
        _type: Type.Boolean,
        _default: true,
        _description: "Whether to save preference as a user property.",
      },
    },
  },
  links: {
    loginSuccess: {
      _type: Type.String,
      _description: "Where to take the user after they are logged in.",
      _default: "${openmrsSpaBase}/home",
      _validators: [validators.isUrl],
    },
  },
  logo: {
    src: {
      _type: Type.String,
      _default: null,
      _description:
        "A path or URL to an image. If null, will use the OpenMRS SVG sprite.",
      _validators: [validators.isUrl],
    },
    alt: {
      _type: Type.String,
      _default: "Logo",
      _description: "Alt text, shown on hover",
    },
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
    numberToShow: boolean;
    locationsPerRequest: number;
    useLoginLocationTag: boolean;
    saveLocationPreference: {
      allowed: boolean;
      savePreferenceOnComputer: boolean;
      savePreferenceAsUserProp: boolean;
    };
  };
  links: {
    loginSuccess: string;
  };
  logo: {
    src: string;
    alt: string;
  };
}

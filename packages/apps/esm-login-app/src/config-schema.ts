import { validators, Type } from "@openmrs/esm-framework";

export const configSchema = {
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
        "A path or URL to an image. Defaults to the OpenMRS SVG sprite.",
    },
    alt: {
      _type: Type.String,
      _default: "Logo",
      _description: "Alt text, shown on hover",
    },
  },
};

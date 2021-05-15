import { Type, validators } from "@openmrs/esm-framework";

export const configSchema = {
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
    name: {
      _type: Type.String,
      _default: null,
      _description: "The organization name displayed when image is absent",
    },
  },
  search: {
    patientResultUrl: {
      _default: "${openmrsSpaBase}/patient/${patientUuid}/chart",
      _description:
        "Where clicking a patient result takes the user. Accepts template parameter ${patientUuid}",
      _validators: [validators.isUrlWithTemplateParameters(["patientUuid"])],
    },
  },
};

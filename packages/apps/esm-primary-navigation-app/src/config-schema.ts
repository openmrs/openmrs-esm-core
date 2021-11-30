import { Type } from "@openmrs/esm-framework";

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
  externalRefLinks: {
    enabled: {
      _type: Type.Boolean,
      _default: true,
      _description: "Whether to show external links in the app menu",
    },
    links: {
      _type: Type.Array,
      _elements: {
        title: {
          _type: Type.String,
          _description: "Title of the link",
        },
        redirect: {
          _type: Type.String,
          _description: "Link to redirect to (must be an external link)",
        },
      },
      _default: [
        {
          title: "Pharmacy",
          redirect: "${openmrsSpaBase}/pharmacy",
        },
        {
          title: "Laboratory",
          redirect: "${openmrsSpaBase}/laboratory",
        },
        {
          title: "Analytics",
          redirect: "${openmrsSpaBase}/analytics",
        },
      ],
      _description: "The links to be showcased in the app menu",
    },
  },
};

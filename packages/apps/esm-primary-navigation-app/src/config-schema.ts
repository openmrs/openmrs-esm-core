import { Type, validators } from '@openmrs/esm-framework';

export const configSchema = {
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
    name: {
      _type: Type.String,
      _default: '',
      _description: 'The organization name displayed when image is absent',
    },
    link: {
      _type: Type.String,
      _default: '${openmrsSpaBase}/home',
      _description: 'The link to redirect to when the logo is clicked',
      _validators: [validators.isUrl],
    },
  },
  externalRefLinks: {
    _type: Type.Array,
    _elements: {
      _type: Type.Object,
      title: {
        _type: Type.String,
        _description: 'Title of the link',
      },
      redirect: {
        _type: Type.String,
        _description: 'Link to redirect to (must be an external link)',
        _validators: [validators.isUrl],
      },
    },
    _default: [],
    _description: 'The external links to be showcased in the app menu',
  },
};

export type ConfigSchema = {
  logo: {
    src: string;
    alt: string;
    name: string;
    link: string;
  };
  externalRefLinks: { title: string; redirect: string }[];
};

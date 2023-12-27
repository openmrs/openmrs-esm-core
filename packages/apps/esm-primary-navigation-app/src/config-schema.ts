import { Type, validators } from '@openmrs/esm-framework';

export const configSchema = {
  logo: {
    src: {
      _type: Type.String,
      _default: null,
      _description: 'A path or URL to an image. Defaults to the OpenMRS SVG sprite.',
      _validators: [validators.isUrl],
    },
    alt: {
      _type: Type.String,
      _default: 'Logo',
      _description: 'Alt text, shown on hover',
    },
    name: {
      _type: Type.String,
      _default: null,
      _description: 'The organization name displayed when image is absent',
    },
    link: {
      _type: Type.String,
      _default: '${openmrsSpaBase}/home',
      _description: 'The link to redirect to when the logo is clicked',
    },
  },
  externalRefLinks: {
    _type: Type.Array,
    _elements: {
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

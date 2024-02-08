import { ConfigSchema, Type, validators } from '@openmrs/esm-framework';

export const esmStyleGuideSchema = {
  'Brand color #1': {
    _default: '#005d5d',
    _type: Type.String,
  },
  'Brand color #2': {
    _default: '#004144',
    _type: Type.String,
  },
  'Brand color #3': {
    _default: '#007d79',
    _type: Type.String,
  },
  preferredCalendar: {
    _type: Type.Object,
    _description:
      "Keys should be locale codes, and values should be the preferred calendar for that locale. For example, {'am': 'ethiopic'}.",
    _default: {
      am: 'ethiopic',
    },
    _elements: {
      _validators: [
        validators.oneOf([
          'buddhist',
          'chinese',
          'coptic',
          'dangi',
          'ethioaa',
          'ethiopic',
          'gregory',
          'hebrew',
          'indian',
          'islamic',
          'islamic-umalqura',
          'islamic-tbla',
          'islamic-civil',
          'islamic-rgsa',
          'iso8601',
          'japanese',
          'persian',
          'roc',
          'islamicc',
        ]),
      ],
    },
  },
};

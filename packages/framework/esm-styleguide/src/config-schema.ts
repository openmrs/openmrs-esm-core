import { type ConfigSchema, Type, validators } from '@openmrs/esm-config';
import { type DiagnosisTagsConfig } from './diagnoses-tags/diagnosis-tags.resource';

export const carbonTagColors = [
  'red',
  'magenta',
  'purple',
  'blue',
  'teal',
  'cyan',
  'gray',
  'orange',
  'green',
  'warm-gray',
  'cool-gray',
  'high-contrast',
  'outline',
] as const;

export const diagnosisTagConfigSchema: ConfigSchema = {
  _type: Type.Array,
  _description: 'Configures the tag colors to display for diagnoses of different ranks (e.g. primary, secondary)',
  _elements: {
    _type: Type.Object,
    _elements: {
      tagColor: {
        _type: Type.String,
        _description: 'The color of the tag',
        _validators: validators.oneOf(carbonTagColors),
      },
      appliedToRanks: {
        _type: Type.Array,
        _elements: {
          _type: Type.Number,
          _description: 'A list of ranks (ex: 1 = Primary, 2 = Secondary) to apply the tag color to',
        },
      },
    },
  },
  _default: [
    { tagColor: 'red', appliedToRanks: [1] },
    { tagColor: 'blue', appliedToRanks: [2] },
  ],
};
export interface StyleguideConfigObject {
  'Brand color #1': string;
  'Brand color #2': string;
  'Brand color #3': string;
  excludePatientIdentifierCodeTypes: {
    uuids: Array<string>;
  };
  implementationName: string;
  patientPhotoConceptUuid: string;
  preferredCalendar: {
    [key: string]: string;
  };
  preferredDateLocale: {
    [key: string]: string;
  };
  diagnosisTags: Array<DiagnosisTagsConfig>;
}

export const esmStyleGuideSchema: ConfigSchema = {
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
  excludePatientIdentifierCodeTypes: {
    uuids: {
      _type: Type.Array,
      _description: 'List of UUIDs of patient identifier types to exclude from rendering in the patient banner',
      _default: [],
      _elements: {
        _type: Type.UUID,
      },
    },
  },
  implementationName: {
    _type: Type.String,
    _description: 'A name of the place (or authority) where all possible locations a user can choose are located.',
    _default: 'Clinic',
  },
  patientPhotoConceptUuid: {
    _type: Type.ConceptUuid,
    _default: '736e8771-e501-4615-bfa7-570c03f4bef5',
    _description:
      "Used to look up the patient photo, which is stored as an attachment obs. Set to `null` in order to disable the feature and use only generated avatars. To remove the avatars entirely, use extension configuration's `remove` feature.",
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
  preferredDateLocale: {
    _type: Type.Object,
    _description:
      "Allows setting the locale used for date formatting for any browser locale. Does not affect time formatting. Keys should be locale codes, and values should be the preferred locale for formatting dates. For example, {'en': 'en-US', 'fr-CA': 'en-CA'}.",
    _default: {
      en: 'en-GB',
    },
    _elements: {
      _type: Type.String,
    },
  },
  diagnosisTags: diagnosisTagConfigSchema,
};

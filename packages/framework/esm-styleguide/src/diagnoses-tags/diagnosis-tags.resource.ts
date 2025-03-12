import { type ConfigSchema, Type, validators } from '@openmrs/esm-config';
import { carbonTagColors } from '../utils';
import { type StyleguideConfigObject } from '../config-schema';
import { useConfig } from '@openmrs/esm-react-utils';
import useSWRImmutable from 'swr/immutable';

/**
 * Return a map of diagnosis rank to the configured color to use to display
 * the diagnosis tag
 */
export function useDiagnosisRankToColorMap() {
  const { diagnosisTags: config } = useConfig<StyleguideConfigObject>({
    externalModuleName: '@openmrs/esm-styleguide',
  });
  const key = '@openmrs/esm-styleguide/diagnosisTags';
  const { data: rankToColorMap } = useSWRImmutable(config ? key : null, () => {
    const map: Record<number, string> = {};
    for (const c of config) {
      for (const rank of c.appliedToRanks) {
        map[rank] = c.tagColor;
      }
    }
    return map;
  });

  return rankToColorMap;
}

export interface DiagnosisTagsConfig {
  tagColor: string;
  appliedToRanks: Array<number>;
}

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

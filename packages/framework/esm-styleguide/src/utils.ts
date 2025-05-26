/**
 * Array of valid values for Carbon tag's "type" attribute.
 * Options from https://react.carbondesignsystem.com/?path=/docs/components-tag--overview
 */
export const carbonTagColors = [
  'red',
  'magenta',
  'purple',
  'blue',
  'teal',
  'cyan',
  'gray',
  'green',
  'warm-gray',
  'cool-gray',
  'high-contrast',
  'outline',
] as const;

export type CarbonTagColor = (typeof carbonTagColors)[number];

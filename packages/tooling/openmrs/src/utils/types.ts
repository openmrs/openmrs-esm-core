export interface PackageJson {
  name: string;
  version?: string;
  browser?: string;
  module?: string;
  main?: string;
  'openmrs:develop'?: {
    command: string;
    url?: string;
    host?: string;
  };
}

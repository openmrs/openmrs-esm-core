export interface PackageJson {
  name: string;
  version?: string;
  browser?: string;
  module?: string;
  main?: string;
  workspaces?: Array<string> | { packages: Array<string> };
  'openmrs:develop'?: {
    command: string;
    url?: string;
    host?: string;
  };
}

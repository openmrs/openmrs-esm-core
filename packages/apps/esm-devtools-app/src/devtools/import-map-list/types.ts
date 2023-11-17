export interface Module {
  moduleName: string;
  defaultUrl?: string | null;
  overrideUrl?: string | null;
  disabled: boolean;
  order: number;
}

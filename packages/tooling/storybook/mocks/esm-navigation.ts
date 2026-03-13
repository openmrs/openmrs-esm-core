// Storybook-compatible mock for @openmrs/esm-navigation.

export type TemplateParams = Record<string, string>;

export interface NavigateOptions {
  to: string;
  templateParams?: TemplateParams;
}

export function navigate(_options: NavigateOptions) {}

export function interpolateUrl(template: string, _additionalParams?: TemplateParams): string {
  return template;
}

export function interpolateString(template: string, params: Record<string, string>): string {
  return Object.entries(params).reduce((result, [key, value]) => result.split('${' + key + '}').join(value), template);
}

export function getHistory() {
  return [];
}
export function clearHistory() {}
export function goBackInHistory() {}

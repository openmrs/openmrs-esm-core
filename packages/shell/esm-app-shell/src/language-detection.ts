/** How the shell picks the UI language, shared by i18next and the pages rendered before it is set up. */
export const languageDetectionOptions = {
  order: ['querystring', 'htmlTag', 'localStorage', 'navigator'],
  lookupQuerystring: 'lang',
};

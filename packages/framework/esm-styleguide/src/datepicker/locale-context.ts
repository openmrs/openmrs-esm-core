import { createContext, useContext } from 'react';

export const OpenmrsIntlLocaleContext = createContext<Intl.Locale | null>(null);

export const useIntlLocale = () => useContext(OpenmrsIntlLocaleContext)!;

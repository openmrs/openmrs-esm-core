import React from 'react';
import type { Preview } from 'storybook-react-rsbuild';
import { setLayoutType } from '../mocks/esm-react-utils';

// Import the styleguide's global stylesheet which brings in Carbon's base
// styles, OpenMRS brand variables, component-specific styles, and overrides.
import '../../../framework/esm-styleguide/src/_all.scss';

// Global setup: window variables, calendar registration, and SVG sprite.
// These must run before any story renders.
import '../mocks/globals-setup';
import '../mocks/svg-setup';

const RTL_LOCALES = new Set(['ar', 'he', 'fa', 'ur']);

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const layoutType = context.globals.layoutType ?? 'small-desktop';
      setLayoutType(layoutType);

      const locale = context.globals.locale ?? 'en';
      (window as any).i18next.language = locale;

      const textDirection = context.globals.textDirection ?? 'auto';
      if (textDirection === 'auto') {
        document.documentElement.dir = RTL_LOCALES.has(locale) ? 'rtl' : 'ltr';
      } else {
        document.documentElement.dir = textDirection;
      }

      return <Story />;
    },
  ],
  globalTypes: {
    layoutType: {
      description: 'Simulated OpenMRS layout type',
      toolbar: {
        title: 'Layout',
        icon: 'mobile',
        items: [
          { value: 'small-desktop', title: 'Small Desktop' },
          { value: 'large-desktop', title: 'Large Desktop' },
          { value: 'tablet', title: 'Tablet' },
          { value: 'phone', title: 'Phone' },
        ],
        dynamicTitle: true,
      },
    },
    locale: {
      description: 'Active locale — affects date formatting, calendar system, and text direction',
      toolbar: {
        title: 'Locale',
        icon: 'globe',
        items: [
          { value: 'en', title: 'English', right: 'en' },
          { value: 'fr', title: 'French', right: 'fr' },
          { value: 'es', title: 'Spanish', right: 'es' },
          { value: 'pt', title: 'Portuguese', right: 'pt' },
          { value: 'am', title: 'Amharic (Ethiopian calendar)', right: 'am' },
          { value: 'hi', title: 'Hindi', right: 'hi' },
          { value: 'km', title: 'Khmer', right: 'km' },
          { value: 'ar', title: 'Arabic (RTL)', right: 'ar' },
          { value: 'he', title: 'Hebrew (RTL)', right: 'he' },
        ],
        dynamicTitle: true,
      },
    },
    textDirection: {
      description: 'Text direction override (auto derives from locale)',
      toolbar: {
        title: 'Direction',
        icon: 'paragraph',
        items: [
          { value: 'auto', title: 'Auto (from locale)' },
          { value: 'ltr', title: 'LTR' },
          { value: 'rtl', title: 'RTL' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    layoutType: 'small-desktop',
    locale: 'en',
    textDirection: 'auto',
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    options: {
      storySort: {
        method: 'alphabetical',
      },
    },
  },
};

export default preview;

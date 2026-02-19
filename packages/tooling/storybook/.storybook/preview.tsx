import React from 'react';
import type { Preview } from 'storybook-react-rsbuild';
import { setLayoutType } from '../mocks/esm-react-utils';

// Import the styleguide's global stylesheet which brings in Carbon's base
// styles, OpenMRS brand variables, component-specific styles, and overrides.
import '../../../framework/esm-styleguide/src/_all.scss';

// Global setup: window variables and SVG sprite registration.
// These must run before any story renders.
import '../mocks/globals-setup';
import '../mocks/svg-setup';

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const layoutType = context.globals.layoutType ?? 'small-desktop';
      setLayoutType(layoutType);

      const dir = context.globals.textDirection ?? 'ltr';
      document.documentElement.dir = dir;

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
    textDirection: {
      description: 'Text direction (LTR or RTL)',
      toolbar: {
        title: 'Direction',
        icon: 'paragraph',
        items: [
          { value: 'ltr', title: 'LTR' },
          { value: 'rtl', title: 'RTL' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    layoutType: 'small-desktop',
    textDirection: 'ltr',
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
  },
};

export default preview;

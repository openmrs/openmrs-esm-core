import React from 'react';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  defineConfigSchema,
  defineExtensionConfigSchema,
  ExtensionSlot,
  getSyncLifecycle,
  openmrsComponentDecorator,
  provide,
  registerExtension,
  updateInternalExtensionStore,
} from '@openmrs/esm-framework/src/internal';
import Dashboard, { dashboardConfigSchema } from './dashboard.component';

const chartApp = '@openmrs/esm-patient-chart-app';
const navApp = '@openmrs/esm-primary-navigation-app';

function registerDashboard() {
  registerExtension({
    name: 'dashboard',
    moduleName: navApp,
    load: getSyncLifecycle(Dashboard, { moduleName: navApp, featureName: 'dashboard', disableTranslations: true }),
    meta: {},
  });
}

function renderSlot(slotName: string) {
  const Host = openmrsComponentDecorator({
    moduleName: chartApp,
    featureName: 'patient chart',
    disableTranslations: true,
  })(() => <ExtensionSlot name={slotName} state={{ basePath: '/patient/123/chart' }} />);

  return render(<Host />);
}

describe('the dashboard extension', () => {
  beforeAll(() => {
    defineConfigSchema(chartApp, {});
    defineExtensionConfigSchema('dashboard', dashboardConfigSchema);
  });

  beforeEach(() => {
    updateInternalExtensionStore(() => ({ slots: {}, extensions: {} }));
    registerDashboard();
  });

  it('renders a link to its path', async () => {
    provide(
      {
        [chartApp]: {
          extensionSlots: {
            'linked-dashboard-slot': {
              add: ['dashboard#ckd'],
              configure: { 'dashboard#ckd': { title: 'CKD Specific', path: 'ckd-specific' } },
            },
          },
        },
      },
      'test',
    );

    renderSlot('linked-dashboard-slot');

    const link = await screen.findByRole('link', { name: 'CKD Specific' });
    expect(link).toHaveAttribute('href', '/patient/123/chart/ckd-specific');
  });

  it('reports the missing path when it has no path configured', async () => {
    provide(
      {
        [chartApp]: {
          extensionSlots: {
            'pathless-dashboard-slot': {
              add: ['dashboard#nowhere'],
              configure: { 'dashboard#nowhere': { title: 'Nowhere' } },
            },
          },
        },
      },
      'test',
    );

    renderSlot('pathless-dashboard-slot');

    expect(await screen.findByText(/without the property "path" being set/)).toBeInTheDocument();
  });
});

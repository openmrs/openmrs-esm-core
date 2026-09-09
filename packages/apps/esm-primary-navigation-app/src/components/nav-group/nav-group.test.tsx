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
  Type,
  updateInternalExtensionStore,
  useConfig,
} from '@openmrs/esm-framework/src/internal';
import Dashboard, { dashboardConfigSchema } from '../dashboard/dashboard.component';
import { NavGroup, navGroupConfigSchema } from './nav-group.component';

const chartApp = '@openmrs/esm-patient-chart-app';
const navApp = '@openmrs/esm-primary-navigation-app';

function renderChartSlot(slotName: string) {
  const Host = openmrsComponentDecorator({
    moduleName: chartApp,
    featureName: 'patient chart',
    disableTranslations: true,
  })(() => <ExtensionSlot name={slotName} state={{ basePath: '/patient/123/chart' }} />);

  return render(<Host />);
}

describe('the nav group extension', () => {
  beforeAll(() => {
    // The nav group renders in this app's own module context, so its config store has to be
    // loaded or `useConfig` suspends for ever.
    defineConfigSchema(navApp, {});
    defineConfigSchema(chartApp, {});
    defineExtensionConfigSchema('nav-group', navGroupConfigSchema);
    defineExtensionConfigSchema('dashboard', dashboardConfigSchema);
  });

  beforeEach(() => {
    updateInternalExtensionStore(() => ({ slots: {}, extensions: {} }));

    registerExtension({
      name: 'nav-group',
      moduleName: navApp,
      load: getSyncLifecycle(NavGroup, { moduleName: navApp, featureName: 'nav group', disableTranslations: true }),
      meta: {},
    });

    registerExtension({
      name: 'dashboard',
      moduleName: navApp,
      load: getSyncLifecycle(Dashboard, { moduleName: navApp, featureName: 'dashboard', disableTranslations: true }),
      meta: {},
    });
  });

  it('opens the slot named by its configuration', async () => {
    function GroupMember() {
      const { label } = useConfig<{ label: string }>();
      return <div>a link labelled {label}</div>;
    }

    defineExtensionConfigSchema('group-member', { label: { _type: Type.String, _default: 'nothing' } });
    registerExtension({
      name: 'group-member',
      moduleName: navApp,
      load: getSyncLifecycle(GroupMember, {
        moduleName: navApp,
        featureName: 'group member',
        disableTranslations: true,
      }),
      meta: {},
    });

    provide(
      {
        [chartApp]: {
          extensionSlots: {
            'titled-group-outer-slot': {
              add: ['nav-group#titled'],
              configure: {
                'nav-group#titled': { title: 'Clinical Views', slotName: 'titled-group-slot' },
              },
            },
            // The group's own slot belongs to the nav app, so configuring its contents from here
            // is the case that has to keep working.
            'titled-group-slot': { add: ['group-member'], configure: { 'group-member': { label: 'Vitals' } } },
          },
        },
      },
      'test',
    );

    renderChartSlot('titled-group-outer-slot');

    expect(await screen.findByText('Clinical Views')).toBeInTheDocument();
    expect(await screen.findByText(/a link labelled/)).toHaveTextContent('a link labelled Vitals');
  });

  // The slot a nav group opens belongs to the nav app, since the nav app renders the group, but
  // the implementer only sees the app they added the group to. Configuration written there has to
  // reach the group's contents.
  it("applies the configuration the outer slot's module gives to extensions inside the group", async () => {
    provide(
      {
        [chartApp]: {
          extensionSlots: {
            'patient-chart-dashboard-slot': {
              add: ['nav-group#clinical-views'],
              configure: {
                'nav-group#clinical-views': { title: 'Clinical Views', slotName: 'clinical-views-group-slot' },
              },
            },
            'clinical-views-group-slot': {
              add: ['dashboard#ckd'],
              configure: { 'dashboard#ckd': { title: 'CKD Specific', path: 'ckd-specific' } },
            },
          },
        },
      },
      'test',
    );

    renderChartSlot('patient-chart-dashboard-slot');

    const link = await screen.findByRole('link', { name: 'CKD Specific' });
    expect(link).toHaveAttribute('href', '/patient/123/chart/ckd-specific');
    expect(screen.queryByText(/without the property "path" being set/)).not.toBeInTheDocument();
  });
});

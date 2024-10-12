import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { type DashboardLinkConfig, DashboardExtension } from './dashboard-extension.component';

export const createDashboardLink = (dashboardLinkConfig: DashboardLinkConfig) => () => (
  <BrowserRouter>
    <DashboardExtension dashboardLinkConfig={dashboardLinkConfig} />
  </BrowserRouter>
);

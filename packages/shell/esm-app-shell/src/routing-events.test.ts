import { afterEach, beforeAll, beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import './routing-events';

function dispatchSingleSpaEvent(detail: {
  appsByNewStatus: {
    MOUNTED: string[];
    NOT_MOUNTED: string[];
    NOT_LOADED: string[];
    SKIP_BECAUSE_BROKEN: string[];
  };
  totalAppChanges: number;
  oldUrl: string;
  newUrl: string;
  cancelNavigation: (val?: boolean | Promise<boolean>) => void;
}) {
  window.dispatchEvent(new CustomEvent('single-spa:before-routing-event', { detail }));
}

function makeEventDetail(overrides: Partial<Parameters<typeof dispatchSingleSpaEvent>[0]> = {}) {
  return {
    appsByNewStatus: {
      MOUNTED: ['@openmrs/esm-patient-chart-app'],
      NOT_MOUNTED: [],
      NOT_LOADED: [],
      SKIP_BECAUSE_BROKEN: [],
    },
    totalAppChanges: 0,
    oldUrl: 'http://localhost/patient/abc-123/chart/vitals',
    newUrl: 'http://localhost/patient/abc-123/chart/conditions',
    cancelNavigation: vi.fn(),
    ...overrides,
  };
}

describe('routing-events', () => {
  let pageChangedHandler: Mock;

  beforeAll(() => {
    // Enable routing events by dispatching the 'started' event
    window.dispatchEvent(new CustomEvent('openmrs:started', { detail: undefined }));
  });

  beforeEach(() => {
    pageChangedHandler = vi.fn();
    window.addEventListener('openmrs:before-page-changed', pageChangedHandler);
  });

  afterEach(() => {
    window.removeEventListener('openmrs:before-page-changed', pageChangedHandler);
  });

  it('should set newPage to the mounted app when totalAppChanges > 0', () => {
    dispatchSingleSpaEvent(
      makeEventDetail({
        totalAppChanges: 1,
        oldUrl: 'http://localhost/home/appointments',
        newUrl: 'http://localhost/patient/abc-123/chart',
      }),
    );

    expect(pageChangedHandler).toHaveBeenCalledTimes(1);
    const payload = pageChangedHandler.mock.calls[0][0].detail;
    expect(payload.newPage).toBe('@openmrs/esm-patient-chart-app');
  });

  it('should set newPage to undefined for pathname-only changes (no app changes)', () => {
    dispatchSingleSpaEvent(
      makeEventDetail({
        totalAppChanges: 0,
        oldUrl: 'http://localhost/home/appointments',
        newUrl: 'http://localhost/home/service-queues',
      }),
    );

    expect(pageChangedHandler).toHaveBeenCalledTimes(1);
    const payload = pageChangedHandler.mock.calls[0][0].detail;
    expect(payload.newPage).toBeUndefined();
  });

  it('should not fire when pathname is the same and no app changes', () => {
    dispatchSingleSpaEvent(
      makeEventDetail({
        totalAppChanges: 0,
        oldUrl: 'http://localhost/home/appointments?tab=scheduled',
        newUrl: 'http://localhost/home/appointments?tab=completed',
      }),
    );

    expect(pageChangedHandler).not.toHaveBeenCalled();
  });
});

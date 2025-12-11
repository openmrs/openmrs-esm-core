import { describe, expect, it, vi } from 'vitest';
import { fireOpenmrsEvent, subscribeOpenmrsEvent } from './index';

describe('Event system', () => {
  describe('fireOpenmrsEvent', () => {
    it('dispatches an event on window by default', () => {
      const handler = vi.fn();
      window.addEventListener('openmrs:started', handler);

      fireOpenmrsEvent('started');

      expect(handler).toHaveBeenCalledOnce();
      window.removeEventListener('openmrs:started', handler);
    });

    it('dispatches an event with payload', () => {
      const handler = vi.fn();
      window.addEventListener('openmrs:before-page-changed', handler);

      const payload = {
        cancelNavigation: vi.fn(),
        newPage: '/home',
        oldUrl: 'http://localhost/old',
        newUrl: 'http://localhost/new',
      };
      fireOpenmrsEvent('before-page-changed', payload);

      expect(handler).toHaveBeenCalledOnce();
      const event = handler.mock.calls[0][0] as CustomEvent;
      expect(event.detail).toEqual(payload);
      window.removeEventListener('openmrs:before-page-changed', handler);
    });

    it('returns true when event is not cancelled', () => {
      const result = fireOpenmrsEvent('started');
      expect(result).toBe(true);
    });

    it('returns false when event is cancelled', () => {
      const handler = (e: Event) => e.preventDefault();
      window.addEventListener('openmrs:started', handler);

      const result = fireOpenmrsEvent('started');

      expect(result).toBe(false);
      window.removeEventListener('openmrs:started', handler);
    });
  });

  describe('subscribeOpenmrsEvent', () => {
    it('subscribes to an event on window by default', () => {
      const handler = vi.fn();
      const unsubscribe = subscribeOpenmrsEvent('started', handler);

      fireOpenmrsEvent('started');

      expect(handler).toHaveBeenCalledOnce();
      unsubscribe();
    });

    it('receives the event payload', () => {
      const handler = vi.fn();
      const unsubscribe = subscribeOpenmrsEvent('before-page-changed', handler);

      const payload = {
        cancelNavigation: vi.fn(),
        newPage: '/home',
        oldUrl: 'http://localhost/old',
        newUrl: 'http://localhost/new',
      };
      fireOpenmrsEvent('before-page-changed', payload);

      expect(handler).toHaveBeenCalledWith(payload);
      unsubscribe();
    });

    it('receives undefined for events without payload', () => {
      const handler = vi.fn();
      const unsubscribe = subscribeOpenmrsEvent('started', handler);

      fireOpenmrsEvent('started');

      expect(handler).toHaveBeenCalledWith(undefined);
      unsubscribe();
    });

    it('unsubscribes correctly', () => {
      const handler = vi.fn();
      const unsubscribe = subscribeOpenmrsEvent('started', handler);

      fireOpenmrsEvent('started');
      expect(handler).toHaveBeenCalledOnce();

      unsubscribe();

      fireOpenmrsEvent('started');
      expect(handler).toHaveBeenCalledOnce();
    });

    it('allows multiple subscribers to the same event', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      const unsubscribe1 = subscribeOpenmrsEvent('started', handler1);
      const unsubscribe2 = subscribeOpenmrsEvent('started', handler2);

      fireOpenmrsEvent('started');

      expect(handler1).toHaveBeenCalledOnce();
      expect(handler2).toHaveBeenCalledOnce();
      unsubscribe1();
      unsubscribe2();
    });

    it('calling unsubscribe multiple times is safe', () => {
      const handler = vi.fn();
      const unsubscribe = subscribeOpenmrsEvent('started', handler);

      unsubscribe();
      expect(() => unsubscribe()).not.toThrow();
    });

    it('unsubscribing one handler does not affect others', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      const unsubscribe1 = subscribeOpenmrsEvent('started', handler1);
      const unsubscribe2 = subscribeOpenmrsEvent('started', handler2);

      unsubscribe1();
      fireOpenmrsEvent('started');

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).toHaveBeenCalledOnce();
      unsubscribe2();
    });
  });
});

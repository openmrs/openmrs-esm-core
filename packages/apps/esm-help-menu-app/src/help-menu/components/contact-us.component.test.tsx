/**
 * @vitest-environment happy-dom
 */
import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ContactUs from './contact-us.component';

describe('ContactUs', () => {
  it('renders a link to the community forum with target _blank', () => {
    render(<ContactUs />);

    const link = screen.getByRole('link', { name: /community forum/i });
    expect(link).toBeDefined();
    expect(link.getAttribute('href')).toBe('https://talk.openmrs.org');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });
});

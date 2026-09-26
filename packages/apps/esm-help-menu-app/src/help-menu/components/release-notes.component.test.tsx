/**
 * @vitest-environment happy-dom
 */
import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReleaseNotes from './release-notes.component';

describe('ReleaseNotes', () => {
  it('renders a link to the release notes with target _blank', () => {
    render(<ReleaseNotes />);

    const link = screen.getByRole('link', { name: /release notes/i });
    expect(link).toBeDefined();
    expect(link.getAttribute('href')).toBe('https://openmrs.atlassian.net/wiki/x/DgAaD');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });
});

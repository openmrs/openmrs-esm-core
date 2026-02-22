import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

window.URL.createObjectURL = vi.fn();

afterEach(cleanup);

import React from 'react';
import Root from './root.component';
import { render } from '@testing-library/react';

describe(`<Root />`, () => {
  it(`renders without dying`, () => {
    render(<Root />);
  });
});

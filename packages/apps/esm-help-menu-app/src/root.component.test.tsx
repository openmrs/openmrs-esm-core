import React from 'react';
import { render } from '@testing-library/react';
import Root from './root.component';

describe(`<Root />`, () => {
  it(`renders without dying`, () => {
    render(<Root />);
  });
});

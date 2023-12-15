import React from 'react';
import Root from './devtools.component';
import { render } from '@testing-library/react';

describe(`<Root />`, () => {
  it(`renders without dying`, () => {
    render(<Root />);
  });
});

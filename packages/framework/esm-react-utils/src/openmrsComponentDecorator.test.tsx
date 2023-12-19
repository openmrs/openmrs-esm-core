import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { openmrsComponentDecorator } from './openmrsComponentDecorator';
import { ComponentContext } from './ComponentContext';

describe('openmrs-component-decorator', () => {
  const opts = {
    featureName: 'Test',
    throwErrorsToConsole: false,
    moduleName: 'test',
  };

  it('renders a component', () => {
    const DecoratedComp = openmrsComponentDecorator(opts)(CompThatWorks);
    render(<DecoratedComp />);

    screen.findByText('The button');
  });

  it('catches any errors in the component tree and renders a ui explaining something bad happened', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    const DecoratedComp = openmrsComponentDecorator(opts)(CompThatThrows);
    render(<DecoratedComp />);
    // TO-DO assert the UX for broken react app is showing
    expect(consoleError).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        message: expect.stringContaining('ahahaa'),
      }),
    );
    consoleError.mockRestore();
  });

  it('provides ComponentContext', () => {
    const DecoratedComp = openmrsComponentDecorator(opts)(CompWithConfig);
    render(<DecoratedComp />);
  });
});

function CompThatWorks() {
  return <button>The button</button>;
}

let CompThatThrows = function () {
  throw Error('ahahaa');
};

function CompWithConfig() {
  const { moduleName } = React.useContext(ComponentContext);
  return <div>{moduleName}</div>;
}

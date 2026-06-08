import React, { useReducer, useState } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useSWR from 'swr';
import { openmrsComponentDecorator } from './openmrsComponentDecorator';

// Regression test for the shared-SWR-cache lifecycle crash: every decorated
// component has its own `<SWRConfig>`, and SWR deletes a provider cache's state
// when the first boundary to init it unmounts. Before the fix, that crashed any
// still-mounted decorated component ("undefined is not iterable").

function decorate(featureName: string, Inner: React.ComponentType) {
  return openmrsComponentDecorator({
    moduleName: featureName.toLowerCase(),
    featureName,
    strictMode: false,
    throwErrorsToConsole: false,
    disableTranslations: true,
  })(Inner);
}

function Widget({ id }: { id: string }) {
  // Touch SWR so this component reads the shared SWRGlobalState on every render.
  useSWR(`widget-${id}`, () => Promise.resolve(id));
  const [count, bump] = useReducer((n) => n + 1, 0);
  return (
    <button type="button" onClick={bump}>
      {id}-{count}
    </button>
  );
}

describe('openmrsComponentDecorator shared SWR cache lifecycle', () => {
  it('keeps a still-mounted decorated component working after a sibling decorated component unmounts', async () => {
    const user = userEvent.setup();

    // `A` renders first, so it is the first `<SWRConfig>` to initialize the
    // shared cache (the boundary that owned SWR's deleter before the fix).
    const A = decorate('A', () => <Widget id="A" />);
    const B = decorate('B', () => <Widget id="B" />);

    function Harness() {
      const [showA, setShowA] = useState(true);
      return (
        <div>
          {showA && <A />}
          <B />
          <button type="button" onClick={() => setShowA(false)}>
            hide-a
          </button>
        </div>
      );
    }

    render(<Harness />);

    expect(await screen.findByRole('button', { name: 'A-0' })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'B-0' })).toBeInTheDocument();

    // Unmount the cache-owning component.
    await user.click(screen.getByRole('button', { name: 'hide-a' }));
    expect(screen.queryByRole('button', { name: 'A-0' })).not.toBeInTheDocument();

    // Force the still-mounted component to re-render. Before the fix this threw
    // and the decorator's error boundary replaced B with an error message.
    await user.click(screen.getByRole('button', { name: 'B-0' }));

    expect(await screen.findByRole('button', { name: 'B-1' })).toBeInTheDocument();
    expect(screen.queryByText(/an error has occurred/i)).not.toBeInTheDocument();
  });

  it('shares cached data across separately decorated components (single global cache, #1397)', async () => {
    // Fixed key, unique within this file (the shared cache persists across renders).
    const key = 'swr-cache-sharing-test';

    function Producer() {
      const { data } = useSWR(key, () => Promise.resolve('shared-value'));
      return <span>producer:{data ?? 'loading'}</span>;
    }

    // The consumer's own fetcher never resolves; if it renders the value, it can
    // only have come from a cache shared with the producer.
    function Consumer() {
      const { data } = useSWR(key, () => new Promise<string>(() => {}));
      return <span>consumer:{data ?? 'loading'}</span>;
    }

    const DecoratedProducer = decorate('Producer', Producer);
    const DecoratedConsumer = decorate('Consumer', Consumer);

    render(<DecoratedProducer />);
    expect(await screen.findByText('producer:shared-value')).toBeInTheDocument();

    render(<DecoratedConsumer />);
    expect(await screen.findByText('consumer:shared-value')).toBeInTheDocument();
  });
});

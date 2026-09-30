import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Link, Loading, Tile } from '@carbon/react';
import {
  getConfig,
  getCoreTranslation,
  interpolateUrl,
  makeUrl,
  type StyleguideConfigObject,
} from '@openmrs/esm-framework/src/internal';

/** How long the server may take to start before the page tells the user it is taking longer than usual. */
export const slowStartupMillis = 30 * 60 * 1000;

interface ServerStartingPageProps {
  logo: StyleguideConfigObject['logo'];
}

export function ServerStartingPage({ logo }: ServerStartingPageProps) {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsSlow(true), slowStartupMillis);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Tile className="omrs-server-starting__tile">
      {logo?.src ? (
        <img className="omrs-server-starting__logo" alt={logo.alt} src={interpolateUrl(logo.src)} />
      ) : (
        <svg role="img" className="omrs-server-starting__logo">
          <title>OpenMRS</title>
          <use href="#omrs-logo-full-color"></use>
        </svg>
      )}
      <Loading withOverlay={false} description={getCoreTranslation('waitingForServer')} />
      <div className="omrs-server-starting__text" aria-live="polite">
        <h1>{getCoreTranslation('serverStartingUp')}</h1>
        <p>
          {isSlow
            ? getCoreTranslation('serverStartingUpSlowExplainer')
            : getCoreTranslation('serverStartingUpExplainer')}
        </p>
      </div>
      <Link href={makeUrl('/initialsetup')}>{getCoreTranslation('viewSetupProgress')}</Link>
    </Tile>
  );
}

/**
 * Renders the page shown while the backend is running its initial setup and returns a function that removes it.
 * It relies on the styleguide config and translations, so it should only be rendered once the app has booted.
 */
export function renderServerStartingPage(): () => void {
  const container = document.createElement('div');
  container.className = 'omrs-server-starting';
  document.body.appendChild(container);

  const root = createRoot(container);
  let removed = false;

  getConfig<StyleguideConfigObject>('@openmrs/esm-styleguide').then(({ logo }) => {
    if (!removed) {
      root.render(<ServerStartingPage logo={logo} />);
    }
  });

  return () => {
    removed = true;
    root.unmount();
    container.remove();
  };
}

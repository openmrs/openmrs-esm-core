import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Header, InlineLoading } from '@carbon/react';
import { ArrowLeft, Close } from '@carbon/react/icons';
import { useLayoutType, isDesktop } from '@openmrs/esm-framework';
import { mountRootParcel, type ParcelConfig } from 'single-spa';
import Parcel from 'single-spa-react/parcel';
import { type OverlayInstance, useOverlayStore } from './overlay.resource';
import classNames from 'classnames';

const OverlayContainer: React.FC = () => {
  const { overlayStack } = useOverlayStore();
  if (!overlayStack.length) {
    return null;
  }
  return (
    <>
      {overlayStack.map((instance, index) => (
        <Overlay overlayInstance={instance} visible={index === 0} key={instance.name} />
      ))}
    </>
  );
};

interface OverlayProps {
  overlayInstance: OverlayInstance;
  visible: boolean;
}

const Overlay: React.FC<OverlayProps> = ({ overlayInstance, visible }) => {
  const { t } = useTranslation();
  const layout = useLayoutType();
  const ref = useRef<HTMLDivElement>(null);
  const [lifecycle, setLifecycle] = useState<ParcelConfig | undefined>();

  useEffect(() => {
    let active = true;
    overlayInstance.load().then(({ default: result, ...lifecycle }) => {
      if (active) {
        setLifecycle(result ?? lifecycle);
      }
    });
    return () => {
      active = false;
    };
  }, [overlayInstance.load]);

  if (!overlayInstance) {
    return null;
  }

  return (
    <div
      className={classNames({
        'omrs--overlay--desktop--overlay': isDesktop(layout),
        'omrs--overlay--tablet--overlay': !isDesktop(layout),
        'omrs--overlay--hidden': !visible,
      })}
    >
      {isDesktop(layout) ? (
        <div className="omrs--overlay--desktop--header">
          <div className="omrs--overlay--header--content">{overlayInstance?.overlayTitle}</div>
          <Button
            className="omrs--overlay--close--btn"
            iconDescription={t('closeOverlay', 'Close overlay')}
            onClick={overlayInstance?.props?.closeOverlay}
            kind="ghost"
            hasIconOnly
            renderIcon={(props) => <Close size={16} {...props} />}
          />
        </div>
      ) : (
        <Header className="omrs--overlay--tablet--header" aria-label="Overlay header">
          <Button
            kind="ghost"
            onClick={overlayInstance?.props?.closeOverlay}
            hasIconOnly
            iconDescription={t('closeOverlay', 'Close overlay')}
            renderIcon={(props) => <ArrowLeft size={16} onClick={close} {...props} />}
          />
          <div className="omrs--overlay--header--content">{overlayInstance?.overlayTitle}</div>
        </Header>
      )}
      <div className="omrs--overlay--content" ref={ref}>
        {lifecycle ? (
          <Parcel
            key={overlayInstance.name}
            config={lifecycle}
            mountParcel={mountRootParcel}
            {...overlayInstance.props}
          />
        ) : (
          <InlineLoading className="omrs--overlay--loading--content" description={`${t('loading', 'Loading...')}`} />
        )}
      </div>
    </div>
  );
};

export default OverlayContainer;

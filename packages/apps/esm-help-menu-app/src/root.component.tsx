import React from 'react';
import HelpMenu from './help-menu/help.component';
export default function Root(props) {
  return (
    <>
      <HelpMenu {...props} />
    </>
  );
}

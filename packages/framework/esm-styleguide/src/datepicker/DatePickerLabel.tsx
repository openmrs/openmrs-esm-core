import classNames from 'classnames';
import React, { forwardRef } from 'react';
import { type LabelProps, useContextProps, LabelContext } from 'react-aria-components';

export const DatePickerLabel = /*#__PURE__*/ forwardRef(function DatePickerLabel(
  props: LabelProps,
  ref: React.Ref<HTMLLabelElement>,
) {
  [props, ref] = useContextProps(props, ref, LabelContext);

  return <label ref={ref} {...props} className={classNames('cds--label', props.className)} />;
});

/** @category Pictograms */
import React, { forwardRef, memo } from 'react';
import classNames, { type Argument } from 'classnames';

export type PictogramProps = {
  className?: Argument;
  size?: number;
};

export type SvgPictogramProps = {
  /** the id of the pictogram  */
  pictogram: string;
  /** properties when using the pictogram  */
  pictogramProps: PictogramProps;
};

/**
 * This is a utility type for custom pictograms
 */
export const Pictogram = memo(
  forwardRef<SVGSVGElement, SvgPictogramProps>(function Pictogram({ pictogram, pictogramProps }, ref) {
    let { className, size } = Object.assign({}, { size: 92 }, pictogramProps);
    if (size <= 26 || size > 144) {
      console.error(`Invalid size '${size}' specified for ${pictogram}. Defaulting to 92.`);
      size = 92;
    }

    return (
      <svg ref={ref} className={classNames(className)} height={size} width={size}>
        <use xlinkHref={`#${pictogram}`} />
      </svg>
    );
  }),
);

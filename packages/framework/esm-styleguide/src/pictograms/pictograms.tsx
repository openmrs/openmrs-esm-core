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
        <use href={`#${pictogram}`} />
      </svg>
    );
  }),
);

export const HomePictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function HomePictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-home" pictogramProps={props} />;
  }),
);

export const PatientListsPictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function PatientListsPictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-patient-lists" pictogramProps={props} />;
  }),
);

export const AppointmentsPictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function AppointmentsPictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-appointments" pictogramProps={props} />;
  }),
);

export const ServiceQueuesPictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function ServiceQueuesPictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-service-queues" pictogramProps={props} />;
  }),
);

export const LaboratoryPictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function LaboratoryPictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-laboratory" pictogramProps={props} />;
  }),
);

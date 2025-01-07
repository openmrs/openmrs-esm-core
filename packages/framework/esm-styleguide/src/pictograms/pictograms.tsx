/** @category Pictograms */
import React, { forwardRef, memo, useEffect, useRef } from 'react';
import classNames, { type Argument } from 'classnames';
import { RenderIfValueIsTruthy } from '@openmrs/esm-react-utils';
import style from './pictograms.module.scss';

export type PictogramProps = {
  className?: Argument;
  size?: number;
};

export const AppointmentsPictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function AppointmentsPictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-appointments" pictogramProps={props} />;
  }),
);

export const HomePictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function HomePictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-home" pictogramProps={props} />;
  }),
);

export const ImagingOrderPictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function ImagingOrderPictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-imaging-order" pictogramProps={props} />;
  }),
);

export const InPatientPictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function InPatientPictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-in-patient" pictogramProps={props} />;
  }),
);

export const LaboratoryPictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function LaboratoryPictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-laboratory" pictogramProps={props} />;
  }),
);

export const MaterialOrderPictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function MaterialOrderPictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-material-order" pictogramProps={props} />;
  }),
);

export const PatientListsPictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function PatientListsPictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-patient-lists" pictogramProps={props} />;
  }),
);

export const PharmacyPictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function PharmacyPictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-pharmacy" pictogramProps={props} />;
  }),
);

export const ProcedureOrderPictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function ProcedureOrderPictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-procedure-order" pictogramProps={props} />;
  }),
);

export const ReferralOrderPictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function ReferralOrderPictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-referral-order" pictogramProps={props} />;
  }),
);

export const RegistrationPictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function RegistrationPictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-registration" pictogramProps={props} />;
  }),
);

export const ServiceQueuesPictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function ServiceQueuesPictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-service-queues" pictogramProps={props} />;
  }),
);

/**
 * This is a utility component that takes an `pictogram` and render it if the sprite for the pictogram
 * is available. The goal is to make it easier to conditionally render configuration-specified pictograms.
 *
 * @example
 * ```tsx
 *   <MaybePictogram pictogram='omrs-icon-baby' className={styles.myPictogramStyles} />
 * ```
 */
export const MaybePictogram = memo(
  forwardRef<SVGSVGElement, { pictogram: string; fallback?: React.ReactNode } & PictogramProps>(function MaybeIcon(
    { pictogram, fallback, ...pictogramProps },
    ref,
  ) {
    const iconRef = useRef(document.getElementById(pictogram));

    useEffect(() => {
      const container = document.getElementById('omrs-svgs-container');
      const callback: MutationCallback = (mutationList) => {
        for (const mutation of mutationList) {
          if (mutation.type === 'childList') {
            iconRef.current = document.getElementById(pictogram);
          }
        }
      };

      const observer = new MutationObserver(callback);
      if (container) {
        observer.observe(container, { childList: true });
      }

      return () => observer.disconnect();
    }, [pictogram]);

    return (
      <RenderIfValueIsTruthy value={iconRef.current} fallback={fallback}>
        <Pictogram ref={ref} pictogram={pictogram} pictogramProps={pictogramProps} />
      </RenderIfValueIsTruthy>
    );
  }),
);

export type SvgPictogramProps = {
  /** the id of the pictogram  */
  pictogram: string;
  /** properties when using the pictogram  */
  pictogramProps: PictogramProps;
};

/**
 * This is a utility type for custom pictograms. Please maintain alphabetical order when adding new pictograms for readability.
 */
export const Pictogram = memo(
  forwardRef<SVGSVGElement, SvgPictogramProps>(function Pictogram({ pictogram, pictogramProps }, ref) {
    let { className, size } = Object.assign({}, { size: 92 }, pictogramProps);
    if (size <= 26 || size > 144) {
      console.error(`Invalid size '${size}' specified for ${pictogram}. Defaulting to 92.`);
      size = 92;
    }

    return (
      <svg ref={ref} className={classNames(style.pictogram, className)} height={size} width={size}>
        <use href={`#${pictogram}`} />
      </svg>
    );
  }),
);

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

export const AppointmentsAltPictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function AppointmentsAltPictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-appointments-alt" pictogramProps={props} />;
  }),
);

export const Assessment1Pictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function Assessment1Pictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-assessment-1" pictogramProps={props} />;
  }),
);

export const Assessment2Pictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function Assessment2Pictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-assessment-2" pictogramProps={props} />;
  }),
);

export const BloodBankPictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function BloodBankPictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-blood-bank" pictogramProps={props} />;
  }),
);

export const CardiologyPictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function CardiologyPictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-cardiology" pictogramProps={props} />;
  }),
);

export const CtScanPictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function CtScanPictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-ct-scan" pictogramProps={props} />;
  }),
);

export const DentistryPictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function DentistryPictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-dentistry" pictogramProps={props} />;
  }),
);

export const EmergencyDepartmentPictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function EmergencyDepartmentPictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-emergency-department" pictogramProps={props} />;
  }),
);

export const FacilityPictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function FacilityPictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-facility" pictogramProps={props} />;
  }),
);

export const GeriatricsPictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function GeriatricsPictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-geriatrics" pictogramProps={props} />;
  }),
);

export const GynaecologyPictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function GynaecologyPictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-gynaecology" pictogramProps={props} />;
  }),
);

export const HomePictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function HomePictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-home" pictogramProps={props} />;
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

export const Labs2Pictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function Labs2Pictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-labs-2" pictogramProps={props} />;
  }),
);

export const ObstetricsPictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function ObstetricsPictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-obstetrics" pictogramProps={props} />;
  }),
);

export const PatientListsPictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function PatientListsPictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-patient-lists" pictogramProps={props} />;
  }),
);

export const PatientSearchPictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function PatientSearchPictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-patient-search" pictogramProps={props} />;
  }),
);

export const PatientsPictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function PatientsPictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-patients" pictogramProps={props} />;
  }),
);

export const PaymentsDeskPictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function PaymentsDeskPictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-payments-desk" pictogramProps={props} />;
  }),
);

export const PharmacyPictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function PharmacyPictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-pharmacy" pictogramProps={props} />;
  }),
);

export const Pharmacy2Pictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function Pharmacy2Pictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-pharmacy-2" pictogramProps={props} />;
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

export const StockManagementPictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function StockManagementPictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-stock-management" pictogramProps={props} />;
  }),
);

export const TransferPictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function TransferPictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-transfer" pictogramProps={props} />;
  }),
);

export const TriagePictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function TriagePictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-triage" pictogramProps={props} />;
  }),
);

export const XrayPictogram = memo(
  forwardRef<SVGSVGElement, PictogramProps>(function XrayPictogram(props, ref) {
    return <Pictogram ref={ref} pictogram="omrs-pict-x-ray" pictogramProps={props} />;
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

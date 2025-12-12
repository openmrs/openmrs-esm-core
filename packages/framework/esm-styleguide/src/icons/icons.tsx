/** @category Icons */
import React, { forwardRef, memo, useEffect, useImperativeHandle, useRef } from 'react';
import classNames, { type Argument } from 'classnames';
import { RenderIfValueIsTruthy } from '@openmrs/esm-react-utils';
import style from './icons.module.scss';

export const iconIds = [
  'omrs-icon-activity',
  'omrs-icon-add',
  'omrs-icon-arrow-down',
  'omrs-icon-arrow-left',
  'omrs-icon-arrow-right',
  'omrs-icon-arrow-up',
  'omrs-icon-baby',
  'omrs-icon-calendar-heat-map',
  'omrs-icon-calendar',
  'omrs-icon-caret-down',
  'omrs-icon-caret-left',
  'omrs-icon-caret-right',
  'omrs-icon-caret-up',
  'omrs-icon-chart-average',
  'omrs-icon-checkmark-filled',
  'omrs-icon-checkmark-outline',
  'omrs-icon-chemistry',
  'omrs-icon-chevron-down',
  'omrs-icon-chevron-left',
  'omrs-icon-chevron-right',
  'omrs-icon-chevron-up',
  'omrs-icon-close',
  'omrs-icon-close-filled',
  'omrs-icon-close-outline',
  'omrs-icon-document',
  'omrs-icon-document-attachment',
  'omrs-icon-download',
  'omrs-icon-drug-order',
  'omrs-icon-edit',
  'omrs-icon-event-schedule',
  'omrs-icon-events',
  'omrs-icon-gender-female',
  'omrs-icon-gender-male',
  'omrs-icon-gender-other',
  'omrs-icon-gender-unknown',
  'omrs-icon-generic-order-type',
  'omrs-icon-group',
  'omrs-icon-group-access',
  'omrs-icon-hospital-bed',
  'omrs-icon-image-medical',
  'omrs-icon-information',
  'omrs-icon-information-filled',
  'omrs-icon-information-square',
  'omrs-icon-inventory-management',
  'omrs-icon-lab-order',
  'omrs-icon-list-checked',
  'omrs-icon-location',
  'omrs-icon-material-order',
  'omrs-icon-maximize',
  'omrs-icon-medication',
  'omrs-icon-message-queue',
  'omrs-icon-microscope',
  'omrs-icon-money',
  'omrs-icon-mother',
  'omrs-icon-movement',
  'omrs-icon-overflow-menu--horizontal',
  'omrs-icon-overflow-menu--vertical',
  'omrs-icon-password',
  'omrs-icon-pedestrian-family',
  'omrs-icon-pen',
  'omrs-icon-printer',
  'omrs-icon-procedure-order',
  'omrs-icon-programs',
  'omrs-icon-renew',
  'omrs-icon-referral-order',
  'omrs-icon-report',
  'omrs-icon-reset',
  'omrs-icon-save',
  'omrs-icon-search',
  'omrs-icon-settings',
  'omrs-icon-shopping-cart',
  'omrs-icon-shopping-cart--arrow-down',
  'omrs-icon-sticky-note-add',
  'omrs-icon-switcher',
  'omrs-icon-syringe',
  'omrs-icon-table-of-contents',
  'omrs-icon-table',
  'omrs-icon-time',
  'omrs-icon-tools',
  'omrs-icon-translate',
  'omrs-icon-trash-can',
  'omrs-icon-tree-view--alt',
  'omrs-icon-user-avatar',
  'omrs-icon-user-follow',
  'omrs-icon-user-xray',
  'omrs-icon-user',
  'omrs-icon-view-off',
  'omrs-icon-view',
  'omrs-icon-warning',
] as const;

export type IconId = (typeof iconIds)[number];

export type IconProps = {
  className?: Argument;
  fill?: string;
  size?: number;
};

/**
 */
export const ActivityIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function ActivityIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-activity" iconProps={props} />;
  }),
);

/**
 */
export const AddIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function AddIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-add" iconProps={props} />;
  }),
);

/**
 */
export const ArrowDownIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function ArrowDownIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-arrow-down" iconProps={props} />;
  }),
);

/**
 */
export const ArrowLeftIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function ArrowLeftIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-arrow-left" iconProps={props} />;
  }),
);

/**
 */
export const ArrowRightIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function ArrowRightIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-arrow-right" iconProps={props} />;
  }),
);

/**
 */
export const ArrowUpIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function ArrowUpIcon(props: IconProps, ref) {
    return <Icon ref={ref} icon="omrs-icon-arrow-up" iconProps={props} />;
  }),
);

/**
 */
export const BabyIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function BabyIcon(props: IconProps, ref) {
    return <Icon ref={ref} icon="omrs-icon-baby" iconProps={props} />;
  }),
);

/**
 */
export const CalendarHeatMapIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function CalendarHeatMap(props: IconProps, ref) {
    return <Icon ref={ref} icon="omrs-icon-calendar-heat-map" iconProps={props} />;
  }),
);

/**
 */
export const CalendarIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function Calendar(props: IconProps, ref) {
    return <Icon ref={ref} icon="omrs-icon-calendar" iconProps={props} />;
  }),
);

/**
 */
export const CaretDownIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function CaretDownIcon(props: IconProps, ref) {
    return <Icon ref={ref} icon="omrs-icon-caret-down" iconProps={props} />;
  }),
);

/**
 */
export const CaretLeftIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function CaretLeftIcon(props: IconProps, ref) {
    return <Icon ref={ref} icon="omrs-icon-caret-left" iconProps={props} />;
  }),
);

/**
 */
export const CaretRightIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function CaretRightIcon(props: IconProps, ref) {
    return <Icon ref={ref} icon="omrs-icon-caret-right" iconProps={props} />;
  }),
);

/**
 */
export const CaretUpIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function CaretUpIcon(props: IconProps, ref) {
    return <Icon ref={ref} icon="omrs-icon-caret-up" iconProps={props} />;
  }),
);

/**
 */
export const ChartAverageIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function ChartAverageIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-chart-average" iconProps={props} />;
  }),
);

/**
 */
export const CheckmarkFilledIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function CheckmarkFilledIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-checkmark-filled" iconProps={props} />;
  }),
);

/**
 */
export const CheckmarkOutlineIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function CheckmarkOutlineIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-checkmark-outline" iconProps={props} />;
  }),
);

/**
 */
export const ChemistryIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function ChemistryIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-chemistry" iconProps={props} />;
  }),
);

/**
 */
export const ChevronDownIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function ChevronDownIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-chevron-down" iconProps={props} />;
  }),
);

/**
 */
export const ChevronLeftIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function ChevronLeftIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-chevron-left" iconProps={props} />;
  }),
);

/**
 */
export const ChevronRightIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function ChevronRightIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-chevron-right" iconProps={props} />;
  }),
);

/**
 */
export const ChevronUpIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function ChevronUpIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-chevron-up" iconProps={props} />;
  }),
);

/**
 */
export const CloseIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function CloseIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-close" iconProps={props} />;
  }),
);

/**
 */
export const CloseFilledIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function CloseFilledIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-close-filled" iconProps={props} />;
  }),
);

/**
 */
export const CloseOutlineIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function CloseOutlineIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-close-outline" iconProps={props} />;
  }),
);

/**
 */
export const DocumentIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function DocumentIcon(props: IconProps, ref) {
    return <Icon ref={ref} icon="omrs-icon-document" iconProps={props} />;
  }),
);

/**
 */
export const DocumentAttachmentIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function DocumentAttachmentIcon(props: IconProps, ref) {
    return <Icon ref={ref} icon="omrs-icon-document-attachment" iconProps={props} />;
  }),
);

/**
 */
export const DownloadIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function DownloadIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-download" iconProps={props} />;
  }),
);

/**
 */
export const DrugOrderIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function DrugOrderIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-drug-order" iconProps={props} />;
  }),
);

/**
 */
export const EditIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function EditIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-edit" iconProps={props} />;
  }),
);

/**
 */
export const EventScheduleIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function EventScheduleIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-event-schedule" iconProps={props} />;
  }),
);

/**
 */
export const EventsIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function EventsIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-events" iconProps={props} />;
  }),
);

/**
 */
export const GenderFemaleIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function GenderFemaleIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-gender-female" iconProps={props} />;
  }),
);
/**
 */
export const GenderMaleIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function GenderMaleIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-gender-male" iconProps={props} />;
  }),
);
/**
 */
export const GenderOtherIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function GenderOtherIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-gender-other" iconProps={props} />;
  }),
);
/**
 */
export const GenderUnknownIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function GenderUnknownIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-gender-unknown" iconProps={props} />;
  }),
);

/**
 */
export const GenericOrderTypeIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function GenericOrderTypeIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-generic-order-type" iconProps={props} />;
  }),
);

/**
 */
export const GroupIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function GroupIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-group" iconProps={props} />;
  }),
);

/**
 */
export const GroupAccessIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function GroupAccessIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-group-access" iconProps={props} />;
  }),
);

/**
 */
export const HospitalBedIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function HospitalBedIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-hospital-bed" iconProps={props} />;
  }),
);

/**
 */
export const ImageMedicalIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function ImageMedicalIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-image-medical" iconProps={props} />;
  }),
);

/**
 */
export const InformationIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function InformationIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-information" iconProps={props} />;
  }),
);

/**
 */
export const InformationFilledIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function InformationFilledIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-information-filled" iconProps={props} />;
  }),
);

/**
 */
export const InformationSquareIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function InformationSquareIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-information-square" iconProps={props} />;
  }),
);

/**
 */
export const InventoryManagementIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function InventoryManagementIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-inventory-management" iconProps={props} />;
  }),
);

/**
 */
export const LabOrderIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function LabOrderIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-lab-order" iconProps={props} />;
  }),
);

/**
 */
export const ListCheckedIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function ListCheckedIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-list-checked" iconProps={props} />;
  }),
);

/**
 */
export const LocationIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function LocationIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-location" iconProps={props} />;
  }),
);

/**
 */
export const MaterialOrderIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function MaterialOrderIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-material-order" iconProps={props} />;
  }),
);

/**
 */
export const MaximizeIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function MaximizeIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-maximize" iconProps={props} />;
  }),
);

/**
 */
export const MedicationIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function MedicationIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-medication" iconProps={props} />;
  }),
);

/**
 */
export const MessageQueueIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function MessageQueueIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-message-queue" iconProps={props} />;
  }),
);

/**
 */
export const MicroscopeIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function MicroscopeIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-microscope" iconProps={props} />;
  }),
);

/**
 * Billing
 */
export const MoneyIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function MoneyIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-money" iconProps={props} />;
  }),
);

/**
 */
export const MotherIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function MotherIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-mother" iconProps={props} />;
  }),
);

/**
 */
export const MovementIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function MovementIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-movement" iconProps={props} />;
  }),
);

/**
 */
export const OverflowMenuHorizontalIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function OverflowMenuHorizontalIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-overflow-menu--horizontal" iconProps={props} />;
  }),
);

/**
 */
export const OverflowMenuVerticalIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function OverflowMenuVerticalIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-overflow-menu--horizontal" iconProps={props} />;
  }),
);

export const PasswordIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function PasswordIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-password" iconProps={props} />;
  }),
);

/**
 */
export const PedestrianFamilyIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function PedestrianFamilyIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-pedestrian-family" iconProps={props} />;
  }),
);

/**
 */
export const PenIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function PenIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-pen" iconProps={props} />;
  }),
);

/**
 */
export const PrinterIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function PrinterIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-printer" iconProps={props} />;
  }),
);

/**
 */
export const ProcedureOrderIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function ProcedureOrderIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-procedure-order" iconProps={props} />;
  }),
);

/**
 */
export const ProgramsIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function ProgramsIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-programs" iconProps={props} />;
  }),
);

/**
 */
export const ReferralOrderIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function ReferralOrderIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-referral-order" iconProps={props} />;
  }),
);

/**
 */
export const RenewIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function RenewIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-renew" iconProps={props} />;
  }),
);

/**
 */
export const ReportIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function ReportIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-report" iconProps={props} />;
  }),
);

/**
 */
export const ResetIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function ResetIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-reset" iconProps={props} />;
  }),
);

/**
 */
export const SaveIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function SaveIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-save" iconProps={props} />;
  }),
);

/**
 */
export const SearchIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function SearchIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-search" iconProps={props} />;
  }),
);

/**
 */
export const SettingsIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function SaveIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-settings" iconProps={props} />;
  }),
);

/**
 */
export const SwitcherIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function SwitcherIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-switcher" iconProps={props} />;
  }),
);

/**
 * Order Basket, the UI to enter Orders for Medications, Referrals, Labs, Procedures and more
 */
export const ShoppingCartIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function ShoppingCartIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-shopping-cart" iconProps={props} />;
  }),
);

/**
 * Used as a button to add an item to the Order basket from a search
 */
export const ShoppingCartArrowDownIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function ShoppingCartArrowDownIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-shopping-cart--arrow-down" iconProps={props} />;
  }),
);

/**
 * Used as action button to open ward in-patient note workspace
 */
export const StickyNoteAddIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function StickyNoteAddIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-sticky-note-add" iconProps={props} />;
  }),
);

/**
 */
export const SyringeIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function SyringeIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-syringe" iconProps={props} />;
  }),
);

/**
 * Used as a button to add an item to the Order basket from a search
 */
export const TableOfContentsIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function TableOfContentsIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-table-of-contents" iconProps={props} />;
  }),
);

/**
 */
export const TableIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function TableIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-table" iconProps={props} />;
  }),
);

/**
 * Lab investigations
 */
export const TimeIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function TimeIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-time" iconProps={props} />;
  }),
);

/**
 */
export const ToolsIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function ToolsIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-tools" iconProps={props} />;
  }),
);

/**
 */
export const TranslateIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function TranslateIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-translate" iconProps={props} />;
  }),
);

/**
 */
export const TrashCanIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function TrashCanIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-trash-can" iconProps={props} />;
  }),
);

/**
 */
export const TreeViewAltIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function TreeViewAltIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-tree-view--alt" iconProps={props} />;
  }),
);

/**
 * User of OpenMRS e.g. My Account
 */
export const UserAvatarIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function UserAvatarIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-user-avatar" iconProps={props} />;
  }),
);

/**
 */
export const UserFollowIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function UserFollowIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-user-follow" iconProps={props} />;
  }),
);

/**
 * UserXray Icon
 *
 * `UserXrayIcon` is also used for imaging orders
 */
export const UserXrayIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function UserXrayIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-user-xray" iconProps={props} />;
  }),
);

/**
 */
export const UserIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function UserIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-user" iconProps={props} />;
  }),
);

/**
 */
export const ViewOffIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function ViewOffIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-view-off" iconProps={props} />;
  }),
);

/**
 */
export const ViewIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function ViewIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-view" iconProps={props} />;
  }),
);

/**
 */
export const WarningIcon = memo(
  forwardRef<SVGSVGElement, IconProps>(function WarningIcon(props, ref) {
    return <Icon ref={ref} icon="omrs-icon-warning" iconProps={props} />;
  }),
);

// Icon aliases that are a little more aligned to specific use-cases
// should all resolve to a defined React icon

/**
 */
export const AllergiesIcon = WarningIcon;

/**
 *
 */
export const AttachmentIcon = DocumentAttachmentIcon;

/**
 * Conditions
 *
 * Note this is an alias for ListCheckedIcon
 */
export const ConditionsIcon = ListCheckedIcon;

/**
 *
 */
export const RadiologyIcon = ImageMedicalIcon;

/**
 * Used as a button to add an item to the Order basket from a search
 *
 * Note this is an alias for ShoppingCartArrowDownIcon
 */
export const ShoppingCartAddItemIcon = ShoppingCartArrowDownIcon;

/**
 * This is a utility component that takes an `icon` and renders it if the sprite for the icon
 * is available. The goal is to make it easier to conditionally render configuration-specified icons.
 *
 * @example
 * ```tsx
 *   <MaybeIcon icon='omrs-icon-baby' className={styles.myIconStyles} />
 * ```
 */
export const MaybeIcon = memo(
  forwardRef<SVGSVGElement, { icon: string | undefined; fallback?: React.ReactNode } & IconProps>(function MaybeIcon(
    { icon, fallback, ...iconProps },
    ref,
  ) {
    const iconRef = useRef(icon ? document.getElementById(icon) : undefined);

    useEffect(() => {
      const container = document.getElementById('omrs-svgs-container');
      const callback: MutationCallback = (mutationList) => {
        for (const mutation of mutationList) {
          if (mutation.type === 'childList') {
            iconRef.current = icon ? document.getElementById(icon) : undefined;
          }
        }
      };

      const observer = new MutationObserver(callback);
      if (container) {
        observer.observe(container, { childList: true });
      }

      return () => observer.disconnect();
    }, [icon]);

    return (
      <RenderIfValueIsTruthy value={iconRef.current} fallback={fallback}>
        <Icon ref={ref} icon={icon as IconId} iconProps={iconProps} />
      </RenderIfValueIsTruthy>
    );
  }),
);

export type SvgIconProps = {
  icon: IconId;
  iconProps: IconProps;
};

/**
 * This is a utility type for custom icons that use the svg-sprite-loader to bundle custom icons
 */
export const Icon = memo(
  forwardRef<SVGSVGElement, SvgIconProps>(function Icon({ icon, iconProps }, ref) {
    let { className, fill, size } = Object.assign({}, { fill: 'currentColor', size: 20 }, iconProps);
    if (size <= 0 || size > 72) {
      console.error(`Invalid size '${size}' specified for ${icon}. Defaulting to 20.`);
      size = 20;
    }
    const iconRef = useRef<SVGSVGElement>(null);

    useImperativeHandle(ref, () => iconRef.current!);

    useEffect(() => {
      if (iconRef.current) {
        if (fill !== 'currentColor') {
          iconRef.current.style.setProperty('--omrs-icon-fill', fill);
        }
      }
    }, []);

    return (
      <svg
        ref={iconRef}
        className={classNames('omrs-icon', style.icon, className)}
        height={size}
        width={size}
        viewBox="0 0 16 16"
      >
        <use href={`#${icon}`} />
      </svg>
    );
  }),
);

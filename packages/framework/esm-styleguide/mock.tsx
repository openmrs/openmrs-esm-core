import React from 'react';

/* Please keep these stubs in alphabetical order for readability */

// Icon stubs
export const ActivityIcon = () => <span>ActivityIcon</span>;
export const AddIcon = () => <span>AddIcon</span>;
export const AllergiesIcon = () => <span>AllergiesIcon</span>;
export const ArrowDownIcon = () => <span>ArrowDownIcon</span>;
export const ArrowLeftIcon = () => <span>ArrowLeftIcon</span>;
export const ArrowRightIcon = () => <span>ArrowRightIcon</span>;
export const ArrowUpIcon = () => <span>ArrowUpIcon</span>;
export const BabyIcon = () => <span>BabyIcon</span>;
export const ChartAverageIcon = () => <span>ChartAverageIcon</span>;
export const CheckmarkFilledIcon = () => <span>CheckmarkFilledIcon</span>;
export const CheckmarkOutlineIcon = () => <span>CheckmarkOutlineIcon</span>;
export const ChemistryIcon = () => <span>ChemistryIcon</span>;
export const ChevronDownIcon = () => <span>ChevronDownIcon</span>;
export const ChevronLeftIcon = () => <span>ChevronLeftIcon</span>;
export const ChevronRightIcon = () => <span>ChevronRightIcon</span>;
export const ChevronUpIcon = () => <span>ChevronUpIcon</span>;
export const CloseFilledIcon = () => <span>CloseFilledIcon</span>;
export const CloseIcon = () => <span>CloseIcon</span>;
export const CloseOutlineIcon = () => <span>CloseOutlineIcon</span>;
export const ConditionsIcon = () => <span>ConditionsIcon</span>;
export const DownloadIcon = () => <span>DownloadIcon</span>;
export const DrugOrderIcon = () => <span>DrugOrderIcon</span>;
export const EditIcon = () => <span>EditIcon</span>;
export const EventScheduleIcon = () => <span>EventScheduleIcon</span>;
export const EventsIcon = () => <span>EventsIcon</span>;
export const GenderFemaleIcon = () => <span>GenderFemaleIcon</span>;
export const GenderMaleIcon = () => <span>GenderMaleIcon</span>;
export const GenderOtherIcon = () => <span>GenderOtherIcon</span>;
export const GenderUnknownIcon = () => <span>GenderUnknownIcon</span>;
export const GenericOrderTypeIcon = () => <span>GenericOrderTypeIcon</span>;
export const GroupAccessIcon = () => <span>GroupAccessIcon</span>;
export const GroupIcon = () => <span>GroupIcon</span>;
export const HospitalBedIcon = () => <span>HospitalBedIcon</span>;
export const Icon = () => <span>Icon</span>;
export const ImageMedicalIcon = () => <span>ImageMedicalIcon</span>;
export const InformationFilledIcon = () => <span>InformationFilledIcon</span>;
export const InformationIcon = () => <span>InformationIcon</span>;
export const InformationSquareIcon = () => <span>InformationSquareIcon</span>;
export const InventoryManagementIcon = () => <span>InventoryManagementIcon</span>;
export const LabOrderIcon = () => <span>LabOrderIcon</span>;
export const ListCheckedIcon = () => <span>ListCheckedIcon</span>;
export const LocationIcon = () => <span>LocationIcon</span>;
export const MaximizeIcon = () => <span>MaximizeIcon</span>;
export const MedicationIcon = () => <span>MedicationIcon</span>;
export const MaterialOrderIcon = () => <span>MaterialOrderIcon</span>;
export const MessageQueueIcon = () => <span>MessageQueueIcon</span>;
export const MicroscopeIcon = () => <span>MicroscopeIcon</span>;
export const MoneyIcon = () => <span>MoneyIcon</span>;
export const MotherIcon = () => <span>MotherIcon</span>;
export const MovementIcon = () => <span>MovementIcon</span>;
export const OverflowMenuHorizontalIcon = () => <span>OverflowMenuHorizontalIcon</span>;
export const OverflowMenuVerticalIcon = () => <span>OverflowMenuVerticalIcon</span>;
export const PasswordIcon = () => <span>PasswordIcon</span>;
export const PedestrianFamilyIcon = () => <span>PedestrianFamilyIcon</span>;
export const PenIcon = () => <span>PenIcon</span>;
export const PrinterIcon = () => <span>PrinterIcon</span>;
export const ProcedureOrderIcon = () => <span>ProcedureOrderIcon</span>;
export const ProgramsIcon = () => <span>ProgramsIcon</span>;
export const RadiologyIcon = () => <span>RadiologyIcon</span>;
export const ReferralOrderIcon = () => <span>ReferralOrderIcon</span>;
export const RenewIcon = () => <span>RenewIcon</span>;
export const ReportIcon = () => <span>ReportIcon</span>;
export const ResetIcon = () => <span>ResetIcon</span>;
export const SaveIcon = () => <span>SaveIcon</span>;
export const SearchIcon = () => <span>SearchIcon</span>;
export const ShoppingCartAddItemIcon = () => <span>ShoppingCartAddItemIcon</span>;
export const ShoppingCartArrowDownIcon = () => <span>ShoppingCartArrowDownIcon</span>;
export const ShoppingCartIcon = () => <span>ShoppingCartIcon</span>;
export const StickyNoteAddIcon = () => <span>StickyNoteAddIcon</span>;
export const SwitcherIcon = () => <span>SwitcherIcon</span>;
export const SyringeIcon = () => <span>SyringeIcon</span>;
export const TableIcon = () => <span>TableIcon</span>;
export const TableOfContentsIcon = () => <span>TableOfContentsIcon</span>;
export const TimeIcon = () => <span>TimeIcon</span>;
export const ToolsIcon = () => <span>ToolsIcon</span>;
export const TranslateIcon = () => <span>TranslateIcon</span>;
export const TrashCanIcon = () => <span>TrashCanIcon</span>;
export const TreeViewAltIcon = () => <span>TreeViewAltIcon</span>;
export const UserAvatarIcon = () => <span>UserAvatarIcon</span>;
export const UserFollowIcon = () => <span>UserFollowIcon</span>;
export const UserIcon = () => <span>UserIcon</span>;
export const UserXrayIcon = () => <span>UserXrayIcon</span>;
export const ViewIcon = () => <span>ViewIcon</span>;
export const ViewOffIcon = () => <span>ViewOffIcon</span>;
export const WarningIcon = () => <span>WarningIcon</span>;

// Pictogram stubs
export const AppointmentsPictogram = () => <span>AppointmentsPictogram</span>;
export const HomePictogram = () => <span>HomePictogram</span>;
export const LaboratoryPictogram = () => <span>LaboratoryPictogramPictogram</span>;
export const PatientListsPictogram = () => <span>PatientListsPictogram</span>;
export const ServiceQueuesPictogram = () => <span>ServiceQueuesPictogramPictogram</span>;

// Misc stubs
export const MaybeIcon = ({ icon }) => <span>{icon}</span>;
export const MaybePictogram = ({ pictogram }) => <span>{pictogram}</span>;

export { PageHeader, PageHeaderContent } from './src/page-header/page-header.component';

export const LocationPicker = jest.fn(({ onChange, selectedLocationUuid }) => {
  const locations = [
    {
      uuid: 'uuid_1',
      name: 'location_1',
    },
    {
      uuid: 'uuid_2',
      name: 'location_2',
    },
  ];
  return (
    <div>
      {locations.map((location) => (
        <label key={location.uuid}>
          <input
            type="radio"
            name="location"
            value={location.uuid}
            checked={location.uuid === selectedLocationUuid}
            onChange={() => onChange(location.uuid)}
          />
          {location.name}
        </label>
      ))}
    </div>
  );
});

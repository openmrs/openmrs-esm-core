import React from 'react';

export const ActivityIcon = () => <div>ActivityIcon</div>;
export const AddIcon = () => <div>AddIcon</div>;
export const ArrowDownIcon = () => <div>ArrowDownIcon</div>;
export const ArrowLeftIcon = () => <div>ArrowLeftIcon</div>;
export const ArrowRightIcon = () => <div>ArrowRightIcon</div>;
export const ArrowUpIcon = () => <div>ArrowUpIcon</div>;
export const ChartAverageIcon = () => <div>ChartAverageIcon</div>;
export const ChemistryIcon = () => <div>ChemistryIcon</div>;
export const ChevronDownIcon = () => <div>ChevronDownIcon</div>;
export const ChevronLeftIcon = () => <div>ChevronLeftIcon</div>;
export const ChevronRightIcon = () => <div>ChevronRightIcon</div>;
export const ChevronUpIcon = () => <div>ChevronUpIcon</div>;
export const CloseFilledIcon = () => <div>CloseFilledIcon</div>;
export const CloseIcon = () => <div>CloseIcon</div>;
export const CloseOutlineIcon = () => <div>CloseOutlineIcon</div>;
export const DownloadIcon = () => <div>DownloadIcon</div>;
export const EditIcon = () => <div>EditIcon</div>;
export const EventScheduleIcon = () => <div>EventScheduleIcon</div>;
export const EventsIcon = () => <div>EventsIcon</div>;
export const GroupIcon = () => <div>GroupIcon</div>;
export const GroupAccessIcon = () => <div>GroupAccessIcon</div>;
export const HospitalBedIcon = () => <div>HospitalBedIcon</div>;
export const ImageMedicalIcon = () => <div>ImageMedicalIcon</div>;
export const InventoryManagementIcon = () => <div>InventoryManagementIcon</div>;
export const RadiologyIcon = () => <div>RadiologyIcon</div>;
export const ListCheckedIcon = () => <div>ListCheckedIcon</div>;
export const ConditionsIcon = () => <div>ConditionsIcon</div>;
export const LocationIcon = () => <div>LocationIcon</div>;
export const MaximizeIcon = () => <div>MaximizeIcon</div>;
export const MedicationIcon = () => <div>MedicationIcon</div>;
export const MessageQueueIcon = () => <div>MessageQueueIcon</div>;
export const MoneyIcon = () => <div>MoneyIcon</div>;
export const MovementIcon = () => <div>MovementIcon</div>;
export const MicroscopeIcon = () => <div>MicroscopeIcon</div>;
export const OverflowMenuHorizontalIcon = () => <div>OverflowMenuHorizontalIcon</div>;
export const OverflowMenuVerticalIcon = () => <div>OverflowMenuVerticalIcon</div>;
export const PedestrianFamilyIcon = () => <div>PedestrianFamilyIcon</div>;
export const PenIcon = () => <div>PenIcon</div>;
export const PrinterIcon = () => <div>PrinterIcon</div>;
export const RenewIcon = () => <div>RenewIcon</div>;
export const ResetIcon = () => <div>ResetIcon</div>;
export const PasswordIcon = () => <div>PasswordIcon</div>;
export const SaveIcon = () => <div>SaveIcon</div>;
export const SearchIcon = () => <div>SearchIcon</div>;
export const SwitcherIcon = () => <div>SwitcherIcon</div>;
export const ShoppingCartIcon = () => <div>ShoppingCartIcon</div>;
export const ShoppingCartArrowDownIcon = () => <div>ShoppingCartArrowDownIcon</div>;
export const ShoppingCartAddItemIcon = () => <div>ShoppingCartAddItemIcon</div>;
export const StickyNoteAddIcon = () => <div>StickyNoteAddIcon</div>;
export const TableOfContentsIcon = () => <div>TableOfContentsIcon</div>;
export const TableIcon = () => <div>TableIcon</div>;
export const TranslateIcon = () => <div>TranslateIcon</div>;
export const TreeViewAltIcon = () => <div>TreeViewAltIcon</div>;
export const TimeIcon = () => <div>TimeIcon</div>;
export const ToolsIcon = () => <div>ToolsIcon</div>;
export const TrashCanIcon = () => <div>TrashCanIcon</div>;
export const UserAvatarIcon = () => <div>UserAvatarIcon</div>;
export const UserFollowIcon = () => <div>UserFollowIcon</div>;
export const UserXrayIcon = () => <div>UserXrayIcon</div>;
export const UserIcon = () => <div>UserIcon</div>;
export const ViewOffIcon = () => <div>ViewOffIcon</div>;
export const ViewIcon = () => <div>ViewIcon</div>;
export const WarningIcon = () => <div>WarningIcon</div>;
export const AllergiesIcon = () => <div>AllergiesIcon</div>;
export const Icon = () => <div>Icon</div>;

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

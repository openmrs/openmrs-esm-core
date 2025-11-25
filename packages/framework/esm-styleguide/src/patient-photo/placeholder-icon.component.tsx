import React from 'react';
import { useTranslation } from 'react-i18next';

interface PlaceholderIconProps {
  width?: number;
  height?: number;
  'aria-label'?: string;
}

const PlaceholderIcon: React.FC<PlaceholderIconProps> = ({ width = 56, height = 56, 'aria-label': ariaLabel }) => {
  const { t } = useTranslation();

  return (
    <svg
      aria-label={ariaLabel ?? t('patientPhotoPlaceholder', 'Patient photo placeholder')}
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="#ffffff" d="M0 0h56v56H0z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="m36.75 20.134-.884-.884L19.25 35.866l.884.884 1.25-1.25H34.25a1.252 1.252 0 0 0 1.25-1.25V21.384l1.25-1.25Zm-2.5 14.116H22.634l4.87-4.87 1.487 1.486a1.25 1.25 0 0 0 1.768 0l.991-.991 2.5 2.498v1.877Zm0-3.645-1.616-1.616a1.25 1.25 0 0 0-1.768 0l-.991.991-1.486-1.486 5.861-5.86v7.971Zm-12.5 1.145v-1.875l3.125-3.123.858.859.885-.885-.86-.86a1.25 1.25 0 0 0-1.767 0l-2.241 2.242V21.75h10V20.5h-10c-.69 0-1.25.56-1.25 1.25v10h1.25Z"
        fill="#8D8D8D"
      />
    </svg>
  );
};

export default PlaceholderIcon;

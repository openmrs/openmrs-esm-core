import React from 'react';

interface LoaderIconProps {
  height?: number;
  width?: number;
}

const LoaderIcon: React.FC<LoaderIconProps> = ({ width = 56, height = 56 }) => (
  <svg height={height} width={width} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56">
    <path fill="#C6C6C6" d="M0 0h56v56H0z" />
    <circle cx="28" cy="21" r="11" fill="#8D8D8D" />
    <path d="M28 31q-16.8 0-16.8 19.6h33.6Q44.8 31 28 31" fill="#8D8D8D" />
  </svg>
);

export default LoaderIcon;

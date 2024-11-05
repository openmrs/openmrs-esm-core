import React from 'react';

export const FemaleIcon: React.FC = () => (
  <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.625 12.457a5 5 0 1 0-1.25 0v1.293H6.25V15h3.125v2.5h1.25V15h3.125v-1.25h-3.125v-1.293zM6.25 7.5a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0z" />
  </svg>
);

export const MaleIcon: React.FC = () => (
  <svg height="20" width="20" viewBox="0 0 20 20">
    <circle cx="8" cy="12" r="5" stroke="#525252" strokeWidth="1" fill="none" />
    <path d="M12 8L17 3M17 3H13M17 3V7" stroke="#525252" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

export const UnknownIcon: React.FC = () => (
  <svg height="20" width="20" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="22.5" r="1.5" />
    <path d="M17 19h-2v-4h2c1.103 0 2-.897 2-2s-.897-2-2-2h-2c-1.103 0-2 .897-2 2v.5h-2V13c0-2.206 1.794-4 4-4h2c2.206 0 4 1.794 4 4s-1.794 4-4 4v2z" />
    <path d="M29.391 14.527 17.473 2.609A2.078 2.078 0 0 0 16 2c-.533 0-1.067.203-1.473.609L2.609 14.527C2.203 14.933 2 15.466 2 16s.203 1.067.609 1.473L14.526 29.39c.407.407.941.61 1.474.61s1.067-.203 1.473-.609L29.39 17.474c.407-.407.61-.94.61-1.474s-.203-1.067-.609-1.473zM16 28.036 3.965 16 16 3.964 28.036 16 16 28.036z" />
    <path d="M0 0h32v32H0z" />
  </svg>
);

export const OtherIcon: React.FC = () => (
  <svg height="20" width="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 2v2h4.586l-6.402 6.401a6.947 6.947 0 0 0-8.368 0L10.414 9 13 6.414 11.586 5 9 7.586 5.414 4H10V2H2v8h2V5.414L7.586 9 5 11.585 6.414 13 9 10.414l1.401 1.401A6.979 6.979 0 0 0 15 22.92V25h-4v2h4v3h2v-3h4v-2h-4v-2.08a6.979 6.979 0 0 0 4.598-11.104L28 5.414V10h2V2Zm-6 19a5 5 0 1 1 5-5 5.006 5.006 0 0 1-5 5Z" />
    <path d="M0 0h32v32H0z" />
  </svg>
);

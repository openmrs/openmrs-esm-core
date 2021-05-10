import React from "react";
import { useConfig } from "@openmrs/esm-framework";

const Logo: React.FC = () => {
  const { logo } = useConfig();
  return (
    <>
      {logo?.src ? (
        <img src={logo.src} alt={logo.alt} width={110} height={40} />
      ) : logo?.name ? (
        logo.name
      ) : (
        <svg role="img" width={110} height={40}>
          <use xlinkHref="#omrs-logo-partial-grey"></use>
        </svg>
      )}
    </>
  );
};

export default Logo;

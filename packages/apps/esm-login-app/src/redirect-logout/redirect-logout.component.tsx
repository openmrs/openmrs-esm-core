import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { navigate, useConfig, useSession } from "@openmrs/esm-framework";
import { performLogout } from "./logout.resource";

export interface RedirectLogoutProps extends RouteComponentProps<{}> {
  isLoginEnabled: boolean;
}

const RedirectLogout: React.FC<RedirectLogoutProps> = ({ isLoginEnabled }) => {
  const config = useConfig();
  const session = useSession();

  useEffect(() => {
    if (!session.authenticated || !isLoginEnabled) {
      navigate({ to: "${openmrsSpaBase}/login" });
    } else {
      performLogout().then(() => {
        if (config.provider.type === "oauth2") {
          location.href = config.provider.logoutUrl;
        } else {
          navigate({ to: "${openmrsSpaBase}/login" });
        }
      });
    }
  }, [isLoginEnabled, session, config]);

  return null;
};

export default RedirectLogout;

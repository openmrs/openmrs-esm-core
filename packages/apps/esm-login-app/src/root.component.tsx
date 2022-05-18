import React from "react";
import Login from "./login/login.component";
import ChooseLocation from "./choose-location/choose-location.component";
import RedirectLogout from "./redirect-logout/redirect-logout.component";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export interface RootProps {
  isLoginEnabled: boolean;
}

const Root: React.FC<RootProps> = ({ isLoginEnabled }) => {
  return (
    <BrowserRouter basename={window.spaBase}>
      <Routes>
        <Route
          path="/login"
          element={<Login isLoginEnabled={isLoginEnabled} />}
        />
        <Route
          path="/login/confirm"
          element={<Login isLoginEnabled={isLoginEnabled} />}
        />
        <Route
          path="/login/location"
          element={<ChooseLocation isLoginEnabled={isLoginEnabled} />}
        />
        <Route
          path="/logout"
          element={<RedirectLogout isLoginEnabled={isLoginEnabled} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Root;

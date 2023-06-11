import React from "react";
import Login from "./login/login.component";
import LocationPicker from "./location-picker/location-picker.component";
import RedirectLogout from "./redirect-logout/redirect-logout.component";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LocationPickerMain from "./location-picker/location-picker-main.component";

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
          element={<LocationPickerMain isLoginEnabled={isLoginEnabled} />}
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

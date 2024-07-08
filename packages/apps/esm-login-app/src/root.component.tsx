import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ChangePassword from './change-password/change-password.component';
import Login from './login/login.component';
import LocationPickerView from './location-picker/location-picker-view.component';
import RedirectLogout from './redirect-logout/redirect-logout.component';

export interface RootProps {}

const Root: React.FC<RootProps> = () => {
  return (
    <BrowserRouter basename={window.getOpenmrsSpaBase()}>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="login/confirm" element={<Login />} />
        <Route path="login/location" element={<LocationPickerView />} />
        <Route path="logout" element={<RedirectLogout />} />
        <Route path="change-password" element={<ChangePassword />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Root;

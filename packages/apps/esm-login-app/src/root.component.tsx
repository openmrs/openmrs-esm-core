import React from 'react';
import Login from './login/login.component';
import RedirectLogout from './redirect-logout/redirect-logout.component';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LocationPickerView from './location-picker-view/location-picker-view.component';

export interface RootProps {}

const Root: React.FC<RootProps> = () => {
  return (
    <BrowserRouter basename={window.getOpenmrsSpaBase()}>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="login/confirm" element={<Login />} />
        <Route path="login/location" element={<LocationPickerView />} />
        <Route path="logout" element={<RedirectLogout />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Root;

import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ChangePassword from './change-password/change-password.component';
import LocationPickerView from './location-picker/location-picker-view.component';
import Login from './login/login.component';
import RedirectLogout from './redirect-logout/redirect-logout.component';
import RequestReset from './reset-password/request-reset.component';
import ResetComplete from './reset-password/reset-complete.component';
import ResetConfirm from './reset-password/reset-confirm.component';
import ResetSent from './reset-password/reset-sent.component';

const Root: React.FC = () => {
  return (
    <BrowserRouter basename={window.getOpenmrsSpaBase()}>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="login/confirm" element={<Login />} />
        <Route path="login/location" element={<LocationPickerView />} />
        <Route path="login/reset" element={<RequestReset />} />
        <Route path="login/reset/sent" element={<ResetSent />} />
        <Route path="login/reset/confirm" element={<ResetConfirm />} />
        <Route path="login/reset/complete" element={<ResetComplete />} />
        <Route path="logout" element={<RedirectLogout />} />
        <Route path="change-password" element={<ChangePassword />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Root;
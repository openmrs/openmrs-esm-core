import React from "react";
import Login from "./login/login.component";
import ChooseLocation from "./choose-location/choose-location.component";
import { BrowserRouter, Route } from "react-router-dom";
import { CurrentUserContext } from "./CurrentUserContext";

export interface RootProps {
  isLoginEnabled: boolean;
}

const Root: React.FC<RootProps> = ({ isLoginEnabled }) => {
  return (
    <CurrentUserContext>
      <BrowserRouter basename={window.spaBase}>
        <Route
          exact
          path="/login(/confirm)?"
          render={(props) => (
            <Login {...props} isLoginEnabled={isLoginEnabled} />
          )}
        />
        <Route
          exact
          path="/login/location"
          render={(props) => (
            <ChooseLocation {...props} isLoginEnabled={isLoginEnabled} />
          )}
        />
      </BrowserRouter>
    </CurrentUserContext>
  );
};

export default Root;

import React from "react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/navbar/navbar.component";
import styles from "./root.scss";

export interface RootProps {}

const Root: React.FC<RootProps> = () => {
  return (
    <BrowserRouter>
      <div className={styles.primaryNavContainer}>
        <Navbar />
      </div>
    </BrowserRouter>
  );
};

export default Root;

import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/navbar.component';
import styles from './root.scss';

const Root: React.FC = () => {
  return (
    <BrowserRouter basename={window.getOpenmrsSpaBase()}>
      <Routes>
        <Route path="login/*" element={null} />
        <Route path="logout/*" element={null} />
        <Route
          path="*"
          element={
            <div className={styles.primaryNavContainer}>
              <Navbar />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Root;

import React from "react";
import { Loading } from "carbon-components-react";
import styles from "./loading.component.scss";

const LoadingIcon: React.FC = () => (
  <div className={styles["centerLoadingSVG"]}>
    <Loading
      description="Active loading indicator"
      role="progressbar"
      withOverlay={false}
      small
    />
  </div>
);

export default LoadingIcon;

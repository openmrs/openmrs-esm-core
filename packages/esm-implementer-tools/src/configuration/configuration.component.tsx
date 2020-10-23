import React from "react";
import {
  getDevtoolsConfig,
  getAreDevDefaultsOn,
  setAreDevDefaultsOn,
  clearTemporaryConfig,
  getTemporaryConfig,
} from "@openmrs/esm-config";
import Switch from "./switch.component";
import styles from "./configuration.styles.css";
import ConfigTree from "./config-tree.component";
import {
  getIsUIEditorEnabled,
  setIsUIEditorEnabled,
} from "@openmrs/esm-extensions";

export default function Configuration(props: ConfigurationProps) {
  const [config, setConfig] = React.useState({});
  const [isDevConfigActive, setIsDevConfigActive] = React.useState(
    getAreDevDefaultsOn()
  );
  const [isUIEditorActive, setIsUIEditorActive] = React.useState(
    getIsUIEditorEnabled()
  );
  const tempConfigObjUrl = new Blob(
    [JSON.stringify(getTemporaryConfig(), undefined, 2)],
    {
      type: "application/json",
    }
  );

  const updateConfig = () => {
    getDevtoolsConfig().then((res) => {
      setConfig(res);
    });
  };

  React.useEffect(updateConfig, []);

  return (
    <div className={styles.panel}>
      <div className={styles.tools}>
        <div className={styles.switch}>
          <Switch
            key={"devConfigSwitch"}
            checked={isDevConfigActive}
            onChange={() => {
              setAreDevDefaultsOn(!isDevConfigActive);
              setIsDevConfigActive(!isDevConfigActive);
            }}
          />
          <div className="omrs-margin-left-12">Dev Config</div>
          <Switch
            key={"uiEditorSwitch"}
            checked={isUIEditorActive}
            onChange={() => {
              setIsUIEditorActive(!isUIEditorActive);
              setIsUIEditorEnabled(!isUIEditorActive);
            }}
          />
          <div className="omrs-margin-left-12">UI Editor</div>
        </div>
        <button
          onClick={() => {
            clearTemporaryConfig();
            updateConfig();
          }}
        >
          Clear Temporary Config
        </button>
        <button className={styles.downloadButton}>
          <a
            className={styles.downloadLink}
            download="temporary_config.json"
            href={window.URL.createObjectURL(tempConfigObjUrl)}
          >
            <svg
              className="omrs-icon"
              fill="rgba(0, 0, 0, 0.54)"
              style={{ height: "1rem" }}
            >
              <use xlinkHref="#omrs-icon-download" />
            </svg>
            Download Temporary Config
          </a>
        </button>
      </div>
      <div className={styles.configContent}>
        <ConfigTree config={config} />
      </div>
    </div>
  );
}

type ConfigurationProps = {
  setHasAlert(value: boolean): void;
};

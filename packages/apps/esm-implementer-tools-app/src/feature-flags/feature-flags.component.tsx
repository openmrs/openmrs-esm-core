import React, { Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Toggle,
} from "@carbon/react";
import styles from "./frontend-modules.scss";
import { registerFeatureFlag, useStore } from "@openmrs/esm-framework";
import {
  featureFlagsStore,
  setFeatureFlag,
} from "@openmrs/esm-framework/src/internal";

export function FeatureFlags() {
  const { flags } = useStore(featureFlagsStore);
  const { t } = useTranslation();

  const headers = useMemo(
    () => [
      {
        key: "label",
        header: t("featureFlag", "Feature Flag"),
      },
      {
        key: "description",
        header: t("description", "Description"),
      },
      {
        key: "enabled",
        header: t("enabled", "Enabled"),
      },
    ],
    [t]
  );

  const rows = useMemo(() => {
    return Object.entries(flags)
      .sort(([ka, va], [kb, vb]) => {
        return (va.label ?? ka).localeCompare(vb.label || kb);
      })
      .map(([name, { enabled, label, description }]) => ({
        name,
        enabled,
        label,
        description,
      }));
  }, [flags]);

  return (
    <div className={styles.container}>
      <DataTable rows={[]} headers={headers}>
        {({ headers, getTableProps, getHeaderProps }) => (
          <TableContainer title="">
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((flag) => (
                  <Fragment key={flag.name}>
                    <TableRow>
                      <TableCell>
                        <div
                          id={`flag-label-${flag.name}`}
                          className={styles.header}
                        >
                          {flag.label}
                        </div>
                        <div className={styles.helper}>{flag.name}</div>
                      </TableCell>
                      <TableCell>
                        <span>{flag.description}</span>
                      </TableCell>
                      <TableCell>
                        <Toggle
                          id={`feature-flag-${flag.name}-toggle`}
                          aria-labelledby={`flag-label-${flag.name}`}
                          labelText="" // using aria-labelledby instead
                          hideLabel={true}
                          toggled={flag.enabled}
                          onToggle={() =>
                            setFeatureFlag(flag.name, !flag.enabled)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    </div>
  );
}

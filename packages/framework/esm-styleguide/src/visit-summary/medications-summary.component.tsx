import React from 'react';
import { capitalize } from 'lodash-es';
import { Tag, Tooltip } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@openmrs/esm-utils';
import { EmptyCard } from '../empty-card';
import { type OrderItem } from './types';
import styles from './visit-detail-overview.module.scss';

interface MedicationSummaryProps {
  medications: Array<OrderItem>;
  drugOrderTypeUUID: string;
}

const MedicationSummary: React.FC<MedicationSummaryProps> = ({ medications, drugOrderTypeUUID }) => {
  const { t } = useTranslation();

  const isDiscontinued = (order: OrderItem['order']) => {
    if (!order?.dateStopped) {
      return false;
    }

    return new Date(order.dateStopped) < new Date();
  };

  const drugOrders = medications?.filter((medication) => {
    return medication?.order?.orderType?.uuid === drugOrderTypeUUID;
  });

  if (drugOrders.length === 0) {
    return (
      <EmptyCard displayText={t('medications__lower', 'medications')} headerTitle={t('medications', 'Medications')} />
    );
  }

  return (
    <div className={styles.medicationRecord}>
      {drugOrders.map(
        (medication, index) =>
          (medication?.order?.dose != null || medication?.order?.dosingInstructions) && (
            <React.Fragment key={index}>
              <div className={styles.medicationContainer}>
                <div>
                  <p className={styles.bodyLong01}>
                    <strong>{capitalize(medication?.order?.drug?.display)}</strong>{' '}
                    {medication?.order?.drug?.strength && (
                      <>&mdash; {medication?.order?.drug?.strength?.toLowerCase()}</>
                    )}{' '}
                    {medication?.order?.doseUnits?.display && (
                      <>&mdash; {medication?.order?.doseUnits?.display?.toLowerCase()}</>
                    )}{' '}
                    {isDiscontinued(medication.order) && (
                      <Tooltip align="right" label={<>{formatDate(new Date(medication.order.dateStopped as Date))}</>}>
                        <Tag type="gray" className={styles.tag}>
                          {t('discontinued', 'Discontinued')}
                        </Tag>
                      </Tooltip>
                    )}
                  </p>
                  <p className={styles.bodyLong01}>
                    {medication?.order?.dose != null ? (
                      <>
                        <span className={styles.label01}> {t('dose', 'Dose').toUpperCase()} </span>{' '}
                        <span className={styles.dosage}>
                          {medication?.order?.dose} {medication?.order?.doseUnits?.display?.toLowerCase()}
                        </span>{' '}
                        {medication.order?.route?.display && (
                          <span>&mdash; {medication?.order?.route?.display?.toLowerCase()} </span>
                        )}
                        {medication?.order?.frequency?.display && (
                          <>
                            {medication.order?.route?.display ? <>&mdash; </> : null}
                            {medication?.order?.frequency?.display?.toLowerCase()}{' '}
                          </>
                        )}
                        {medication?.order?.duration != null && (
                          <>
                            &mdash;{' '}
                            {t('orderDurationAndUnit', 'for {{duration}} {{durationUnit}}', {
                              duration: medication?.order?.duration,
                              durationUnit: medication?.order?.durationUnits?.display?.toLowerCase(),
                            })}
                          </>
                        )}
                        {medication?.order?.duration == null && (
                          <>&mdash; {t('orderIndefiniteDuration', 'Indefinite duration')}</>
                        )}
                        {medication?.order?.numRefills != null && medication?.order?.numRefills !== 0 && (
                          <span>
                            <span className={styles.label01}> &mdash; {t('refills', 'Refills').toUpperCase()}</span>{' '}
                            {medication?.order?.numRefills}
                          </span>
                        )}
                        {medication?.order?.dosingInstructions && (
                          <span> &mdash; {medication?.order?.dosingInstructions?.toLocaleLowerCase()}</span>
                        )}
                      </>
                    ) : (
                      <>
                        <span className={styles.label01}>
                          {t('dosingInstructions', 'Dosing Instructions').toUpperCase()}{' '}
                        </span>
                        <span className={styles.dosage}>{medication?.order?.dosingInstructions}</span>
                        {medication?.order?.duration != null && (
                          <span>
                            {' '}
                            &mdash;{' '}
                            {t('orderDurationAndUnit', 'for {{duration}} {{durationUnit}}', {
                              duration: medication?.order?.duration,
                              durationUnit: medication?.order?.durationUnits?.display?.toLowerCase(),
                            })}
                          </span>
                        )}
                        {medication?.order?.numRefills != null && medication?.order?.numRefills !== 0 && (
                          <span>
                            <span className={styles.label01}> &mdash; {t('refills', 'Refills').toUpperCase()}</span>{' '}
                            {medication?.order?.numRefills}
                          </span>
                        )}
                      </>
                    )}
                  </p>
                  <p className={styles.bodyLong01}>
                    {medication?.order?.orderReasonNonCoded ? (
                      <span>
                        <span className={styles.label01}>{t('indication', 'Indication').toUpperCase()}</span>{' '}
                        {medication?.order?.orderReasonNonCoded}
                      </span>
                    ) : null}
                    {medication?.order?.orderReasonNonCoded && medication?.order?.quantity != null && <>&mdash;</>}
                    {medication?.order?.quantity != null ? (
                      <span>
                        <span className={styles.label01}> {t('quantity', 'Quantity').toUpperCase()}</span>{' '}
                        {medication?.order?.quantity}
                      </span>
                    ) : null}
                    {medication?.order?.dateStopped ? (
                      <span className={styles.bodyShort01}>
                        <span className={styles.label01}>
                          {medication?.order?.quantity != null ? ` — ` : ''} {t('endDate', 'End date').toUpperCase()}
                        </span>{' '}
                        {formatDate(new Date(medication?.order?.dateStopped))}
                      </span>
                    ) : null}
                  </p>
                </div>
              </div>

              <p className={styles.metadata}>
                <div className={styles.startDateColumn}>
                  <span>{formatDate(new Date(medication.order.dateActivated))}</span> &middot;{' '}
                  <span>{medication.order.orderer?.display ?? '--'}</span>
                </div>
              </p>
            </React.Fragment>
          ),
      )}
    </div>
  );
};

export default MedicationSummary;

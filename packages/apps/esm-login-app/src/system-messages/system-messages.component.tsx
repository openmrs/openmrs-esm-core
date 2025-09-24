import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { InlineNotification } from '@carbon/react';
import { useConfig } from '@openmrs/esm-framework';
import { type ConfigSchema } from '../config-schema';
import styles from './system-messages.scss';

interface SystemMessagesProps {
  page?: 'login' | 'location-picker';
}

const SystemMessages: React.FC<SystemMessagesProps> = ({ page = 'login' }) => {
  const { t } = useTranslation();
  const config = useConfig<ConfigSchema>();
  const [dismissedMessages, setDismissedMessages] = useState<Set<string>>(new Set());

  const handleDismiss = useCallback((messageId: string) => {
    setDismissedMessages((prev) => new Set([...prev, messageId]));
  }, []);

  const visibleMessages = useMemo(() => {
    if (!config.systemMessages.enabled) {
      return [];
    }

    const now = new Date();

    return config.systemMessages.messages.filter((message) => {
      // Check if message is dismissed
      if (dismissedMessages.has(message.id)) {
        return false;
      }

      // Check page visibility
      if (message.showOn !== 'all' && message.showOn !== page) {
        return false;
      }

      // Check date range
      if (message.startDate) {
        const startDate = new Date(message.startDate);
        if (now < startDate) {
          return false;
        }
      }

      if (message.endDate) {
        const endDate = new Date(message.endDate);
        if (now > endDate) {
          return false;
        }
      }

      return true;
    });
  }, [config.systemMessages, dismissedMessages, page]);

  if (visibleMessages.length === 0) {
    return null;
  }

  return (
    <div className={styles.systemMessagesContainer}>
      {visibleMessages.map((message) => (
        <div key={message.id} className={styles.systemMessage}>
          <InlineNotification
            kind={message.type}
            title={message.title ? t(message.title) : undefined}
            subtitle={t(message.content)}
            onClose={message.dismissible ? () => handleDismiss(message.id) : undefined}
            hideCloseButton={!message.dismissible}
          />
          {/* For HTML content, we'll show it below the notification */}
          {message.content.includes('<') && (
            <div
              className={styles.htmlContent}
              dangerouslySetInnerHTML={{
                __html: t(message.content),
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default SystemMessages;

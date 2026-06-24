import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import type { Note } from './types';
import { EmptyCard } from '../empty-card';
import styles from './visit-detail-overview.module.scss';

interface NotesSummaryProps {
  notes: Array<Note>;
}

const NotesSummary: React.FC<NotesSummaryProps> = ({ notes }) => {
  const { t } = useTranslation();

  if (notes.length === 0) {
    return <EmptyCard displayText={t('notes__lower', 'notes')} headerTitle={t('notes', 'Notes')} />;
  }

  return (
    <>
      {notes.map((note: Note, index) => (
        <div className={styles.notesContainer} key={index}>
          <p className={classNames(styles.noteText, styles.bodyLong01)}>{note.note}</p>
          <p className={styles.metadata}>
            {note.time} {note.provider.name ? <span>&middot; {note.provider.name} </span> : null}
            {note.provider.role ? <span>&middot; {note.provider.role}</span> : null}
          </p>
        </div>
      ))}
    </>
  );
};

export default NotesSummary;

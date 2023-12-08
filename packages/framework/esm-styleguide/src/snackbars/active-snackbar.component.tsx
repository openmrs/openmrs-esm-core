import React, { useEffect, useState, useCallback } from 'react';
import { Subject } from 'rxjs';
import { Snackbar, SnackbarMeta } from './snackbar.component';

interface ActiveSnackbarProps {
  subject: Subject<SnackbarMeta>;
}

const ActiveSnackbars: React.FC<ActiveSnackbarProps> = ({ subject }) => {
  const [snackbars, setSnackbars] = useState<Array<SnackbarMeta>>([]);

  const closeSnackbar = useCallback((snackbar) => {
    setSnackbars((snackbars) => snackbars.filter((t) => t !== snackbar));
  }, []);

  useEffect(() => {
    const subscription = subject.subscribe((snackbar) =>
      setSnackbars((snackbars) => [
        ...snackbars.filter(
          (n) =>
            n.subtitle !== snackbar.subtitle ||
            n.actionButtonLabel !== snackbar.actionButtonLabel ||
            n.onActionButtonClick !== snackbar.onActionButtonClick ||
            n.kind !== snackbar.kind ||
            n.title !== snackbar.title,
        ),
        snackbar,
      ]),
    );

    return () => subscription.unsubscribe();
  }, [subject]);

  return (
    <>
      {snackbars.map((snackbar) => (
        <Snackbar key={snackbar.id} snackbar={snackbar} closeSnackbar={() => closeSnackbar(snackbar)} />
      ))}
    </>
  );
};

export default ActiveSnackbars;

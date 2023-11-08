import React, { useEffect, useState, useCallback } from "react";
import { Subject } from "rxjs";
import { SnackBarComponent, SnackBarMeta } from "./snack-bar.component";

interface ActiveSnackBarProps {
  subject: Subject<SnackBarMeta>;
}

const ActiveSnackBars: React.FC<ActiveSnackBarProps> = ({ subject }) => {
  const [snackBars, setSnackBars] = useState<Array<SnackBarMeta>>([]);

  const closeSnackBar = useCallback((snackBar) => {
    setSnackBars((snackBars) => snackBars.filter((t) => t !== snackBar));
  }, []);

  useEffect(() => {
    const subscription = subject.subscribe((snackBar) =>
      setSnackBars((snackBars) => [
        ...snackBars.filter(
          (n) =>
            n.subtitle !== snackBar.subtitle ||
            n.actionButtonLabel !== snackBar.actionButtonLabel ||
            n.onActionButtonClick !== snackBar.onActionButtonClick ||
            n.kind !== snackBar.kind ||
            n.title !== snackBar.title
        ),
        snackBar,
      ])
    );

    return () => subscription.unsubscribe();
  }, [subject]);

  return (
    <>
      {snackBars.map((snackBar) => (
        <SnackBarComponent
          key={snackBar.id}
          snackBar={snackBar}
          closeSnackBar={() => closeSnackBar(snackBar)}
        />
      ))}
    </>
  );
};

export default ActiveSnackBars;

import React, { useEffect, useState, useCallback } from "react";
import { Subject } from "rxjs";
import {
  ActionableToast,
  ActionableToastMeta,
} from "./actionable-toast.component";

interface ActiveActionableToastProps {
  subject: Subject<ActionableToastMeta>;
}

const ActiveActionableToasts: React.FC<ActiveActionableToastProps> = ({
  subject,
}) => {
  const [actionableToasts, setActionableToasts] = useState<
    Array<ActionableToastMeta>
  >([]);

  const closeActionableToast = useCallback((toast) => {
    setActionableToasts((actionableToasts) =>
      actionableToasts.filter((t) => t !== toast)
    );
  }, []);

  useEffect(() => {
    const subscription = subject.subscribe((actionableToast) =>
      setActionableToasts((actionableToasts) => [
        ...actionableToasts.filter(
          (n) =>
            n.subtitle !== actionableToast.subtitle ||
            n.actionButtonLabel !== actionableToast.actionButtonLabel ||
            n.onActionButtonClick !== actionableToast.onActionButtonClick ||
            n.kind !== actionableToast.kind ||
            n.title !== actionableToast.title
        ),
        actionableToast,
      ])
    );

    return () => subscription.unsubscribe();
  }, [subject]);

  return (
    <>
      {actionableToasts.map((actionableToast) => (
        <ActionableToast
          key={actionableToast.id}
          actionableToast={actionableToast}
          closeActionableToast={() => closeActionableToast(actionableToast)}
        />
      ))}
    </>
  );
};

export default ActiveActionableToasts;

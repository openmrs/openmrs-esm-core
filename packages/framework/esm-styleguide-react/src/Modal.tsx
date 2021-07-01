import React from "react";
import ReactDOM from "react-dom";
import style from "./style.scss";

const Modal: React.FC<{ close: () => void }> = ({ children, close }) => {
  const [modal, setModal] = React.useState<HTMLDivElement>();

  React.useEffect(() => {
    const m = document.createElement("div");
    document.body.append(m);

    m.className = style.modal;
    m.onclick = (e) => {
      if (e.target === m) {
        e.preventDefault();
        close();
      }
    };
    setModal(m);
    return () => {
      setTimeout(() => {
        m.remove();
      }, 0);
    };
  }, []);

  if (!modal) {
    return null;
  }

  return ReactDOM.createPortal(children, modal);
};

export default Modal;

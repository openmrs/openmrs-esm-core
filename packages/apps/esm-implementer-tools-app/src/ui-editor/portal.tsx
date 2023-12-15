import { createPortal } from 'react-dom';

export function Portal({ el, children }) {
  return el ? createPortal(children, el) : null;
}

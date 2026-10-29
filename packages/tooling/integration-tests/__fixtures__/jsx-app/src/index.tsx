// A remote that renders JSX and imports `react-dom/client`, so a build of it shows which of React's
// entry points the shared configs federate. It declares `react` as a peer but not `react-dom`, as
// several frontend modules in the reference application do.
import { createRoot } from 'react-dom/client';

function NameList({ names }: { names: Array<string> }) {
  return (
    <ul>
      {names.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
}

export function startupApp() {
  return [typeof createRoot, typeof NameList];
}

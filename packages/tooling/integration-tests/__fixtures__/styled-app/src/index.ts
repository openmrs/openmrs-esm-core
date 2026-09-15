// A remote whose `./start` chunk pulls in a stylesheet, so that a build of it shows how CSS is
// delivered: extracted to a `.css` asset in production, inlined by `style-loader` in development.
import styles from './styles.module.scss';

export function startupApp() {
  return styles.panel;
}

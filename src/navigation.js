import { useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';

// Props for link-like MUI components. Only /app/ is routed by React; other
// paths (/free-hand/, /fold-line/, /api/) are server pages and need a real load.
export const linkProps = path => path.startsWith('/app/') ?
  { component: Link, to: path } : { component: 'a', href: path };

// Moves to an app page after an async action. Moving to the current URL shows
// the page again with fresh data. Does nothing once the calling component is
// gone, so a late response cannot pull the user away from another page.
export const useAppNavigate = () => {
  const history = useHistory();
  const mounted = useRef(true);
  useEffect(() => () => { mounted.current = false; }, []);
  return path => {
    if (!mounted.current) return;
    const { pathname, search } = history.location;
    if (path === pathname + search) history.replace(path);
    else history.push(path);
  };
};

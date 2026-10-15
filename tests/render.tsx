import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppStateProvider } from '@/context/AppStateContext';
import { AppRoutes } from '@/routes/AppRoutes';
import { HIW_SEEN_KEY } from '@/store/appState';
import '@/styles/global.css';

/**
 * Render the whole application at a given route, with the first-run explainer
 * already dismissed so tests start on the screen under test.
 */
export function renderApp(route = '/') {
  sessionStorage.setItem(HIW_SEEN_KEY, '1');
  const user = userEvent.setup();
  const view = render(
    <MemoryRouter initialEntries={[route]}>
      <AppStateProvider>
        <AppRoutes />
      </AppStateProvider>
    </MemoryRouter>,
  );
  return { user, ...view };
}

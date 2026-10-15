import { QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppStateProvider } from '@/context/AppStateContext';
import { createQueryClient } from '@/lib/queryClient';
import { AppRoutes } from '@/routes/AppRoutes';
import { HIW_SEEN_KEY } from '@/store/appState';
import '@/styles/global.css';

/**
 * Render the whole application at a given route, with the first-run explainer
 * already dismissed so tests start on the screen under test.
 *
 * The provider tree mirrors `App.tsx`, with a Query client built per render so
 * one test's cache cannot leak into the next.
 */
export function renderApp(route = '/') {
  sessionStorage.setItem(HIW_SEEN_KEY, '1');
  const user = userEvent.setup();
  const view = render(
    <MemoryRouter initialEntries={[route]}>
      <QueryClientProvider client={createQueryClient()}>
        <AppStateProvider>
          <AppRoutes />
        </AppStateProvider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
  return { user, ...view };
}

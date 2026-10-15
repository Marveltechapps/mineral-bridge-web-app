import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AppStateProvider } from '@/context/AppStateContext';
import { queryClient } from '@/lib/queryClient';
import { AppRoutes } from '@/routes/AppRoutes';
import '@/styles/global.css';
import '@/styles/responsive.css';

export default function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppStateProvider>
          <AppRoutes />
        </AppStateProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

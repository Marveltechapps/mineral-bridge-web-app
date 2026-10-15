import { BrowserRouter } from 'react-router-dom';
import { AppStateProvider } from '@/context/AppStateContext';
import { AppRoutes } from '@/routes/AppRoutes';
import '@/styles/global.css';
import '@/styles/responsive.css';

export default function App() {
  return (
    <BrowserRouter>
      <AppStateProvider>
        <AppRoutes />
      </AppStateProvider>
    </BrowserRouter>
  );
}

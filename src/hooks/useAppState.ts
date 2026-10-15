import { useContext } from 'react';
import { AppStateContext, type AppStateContextValue } from '@/context/AppStateContext';

/** Access the shared application state, its updater and the navigation helper. */
export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside an AppStateProvider');
  return ctx;
}

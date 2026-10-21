import { useEffect } from 'react';
import { http } from '@/lib/api/client';
import { isApiConfigured } from '@/lib/api/config';
import { getSession, isSignedIn, restoreSession, subscribe } from '@/lib/auth/session';
import type { AppState } from '@/store/appState';

type StatePatch = Partial<AppState> | ((prev: AppState) => Partial<AppState>);

/**
 * Keeps the interface's idea of being signed in aligned with the actual session
 * — ARCHITECTURE.md §8.
 *
 * The direction that matters is the involuntary one. When a request comes back
 * 401 and the refresh fails, `lib/auth/session` drops to anonymous, and without
 * this the application would carry on presenting someone as signed in with no
 * credential behind it. Here that ends the session in the interface too and
 * opens the login overlay, remembering the current screen in `pendingResume` so
 * signing back in returns to it — the same mechanism the design already uses
 * when an unauthenticated person tries to bid or sell.
 *
 * Nothing triggers it today: there is no backend, so no request can 401 and no
 * refresh can fail. It is the piece that makes an expiring session behave
 * correctly the moment one exists.
 *
 * Note on the other direction: signing in is still applied by `verifyOtp` in
 * the same patch that closes the overlay and routes onward, rather than being
 * left to this listener. Keeping it in one atomic update guarantees there is no
 * frame where the overlay has closed but the header has not yet caught up, and
 * this application's rendering is verified pixel by pixel against its design.
 * `signIn()` is still called there, so the credential store remains the single
 * source for anything making a request.
 */
export function useSessionSync(setState: (patch: StatePatch) => void): void {
  useEffect(() => {
    if (!isApiConfigured()) return;
    let cancelled = false;
    void restoreSession().then(async (ok) => {
      if (cancelled) return;
      if (!ok) {
        setState({ sessionReady: true });
        return;
      }
      try {
        const me = await http.get<{
          kycStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
          user?: { fullName?: string; email?: string; mobile?: string; countryName?: string; companyName?: string | null };
        }>('/auth/me');
        if (cancelled) return;
        const kycStatus = me.kycStatus === 'pending' || me.kycStatus === 'verified' ? me.kycStatus : 'unverified';
        setState((previous) => ({
          sessionReady: true,
          authed: true,
          kycStatus,
          accForm: {
            ...previous.accForm,
            name: me.user?.fullName || previous.accForm.name,
            email: me.user?.email || previous.accForm.email,
            mobile: me.user?.mobile || previous.accForm.mobile,
            country: me.user?.countryName || previous.accForm.country,
            company: me.user?.companyName ?? '',
          },
        }));
      } catch {
        if (!cancelled) setState({ sessionReady: true, authed: true });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [setState]);

  useEffect(
    () =>
      subscribe(() => {
        const signedIn = isSignedIn();
        const expired = getSession().endedBy === 'expired';
        setState((previous) => {
          if (previous.authed === signedIn) return {};
          if (signedIn) return { authed: true };
          // Someone who chose to log out is left alone; their handler decides
          // where they go next. Only a session that ended under them is asked
          // to sign in again.
          if (!expired) return { authed: false };
          return {
            authed: false,
            modal: null,
            authOpen: true,
            authMode: 'login',
            authStage: 'form',
            authVerifying: false,
            pendingResume: previous.route,
          };
        });
      }),
    [setState],
  );
}

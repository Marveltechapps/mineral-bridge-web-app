import { useMemo } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { markHiwSeen, type AppState } from '@/store/appState';
import type { RouteKey } from '@/types';

/**
 * Cross-cutting handlers shared by the shell and several screens, ported from
 * the `h` object the design's `renderVals()` returns. Feature-specific
 * handlers live with their own view models.
 */
export function useActions() {
  const { state, setState, go } = useAppState();

  return useMemo(() => {
    const closeModal = () => setState({ modal: null });

    /** Show a simple acknowledgement sheet. */
    const note = (title: string, body: string, confirmLabel = 'Done') =>
      setState({ modal: { title, body, confirmLabel, confirm: closeModal } });

    /**
     * Gate an action behind an *approved* KYC — a pending submission is not
     * enough, matching the design's `requireKyc`.
     */
    const requireKyc = (what: string, proceed: () => void, returnTo?: RouteKey) => {
      if (state.kycStatus === 'verified') {
        proceed();
        return;
      }
      const back = returnTo || state.route;
      if (state.kycStatus === 'pending') {
        setState({
          modal: {
            title: 'Verification still under review',
            body: `Your documents are with our compliance desk. You can browse freely, but you can only ${what} once verification is approved — usually within 24 hours.`,
            confirmLabel: 'View status',
            confirm: () => {
              setState({ modal: null, kycStage: 'pending', kycReturn: back });
              go('kyc');
            },
          },
        });
        return;
      }
      setState({
        modal: {
          title: 'Verification required',
          body: `Mineral trading is regulated, so we verify identity before you can ${what}. It takes about two minutes.`,
          confirmLabel: 'Verify my identity',
          confirm: () => {
            setState({ modal: null, kycStage: 'why', kycReturn: back });
            go('kyc');
          },
        },
      });
    };

    const openAccEdit = (kind: string) => {
      setState((s: AppState) => ({
        accEditKind: kind,
        accForm: { ...s.accForm, ...(s.accSaved || {}), pw: '' },
      }));
      go('accEdit');
    };

    return {
      requireKyc,
      openAccEdit,
      note,
      closeModal,
      goHome: () => go('home'),
      goBuy: () => go('buy'),
      goSell: () => go('sell'),
      goOrders: () => go('orders'),
      goAccount: () => go('account'),
      goAuctions: () => go('auctions'),
      goAcademy: () => go('academy'),
      goKyc: () => go('kyc'),
      startSelling: () => go('sell'),
      signIn: () =>
        setState({ authOpen: true, authMode: 'login', authStage: 'form', authVerifying: false }),
      openSignup: () =>
        setState({ authOpen: true, authMode: 'signup', authStage: 'form', authVerifying: false }),
      setQuery: (e: React.ChangeEvent<HTMLInputElement>) => setState({ query: e.target.value }),
      goHowItWorks: () => setState({ hiwOverlay: true, hiwPlaying: false }),
      closeHiw: () => {
        markHiwSeen();
        setState({ hiwOverlay: false, hiwPlaying: false });
      },
      hiwFullPage: () => {
        markHiwSeen();
        setState({ hiwOverlay: false, hiwPlaying: false });
        go('howItWorks');
      },
      goKycFromBanner: () => {
        setState({
          kycStage: state.kycStatus === 'pending' ? 'pending' : 'why',
          kycReturn: state.route,
        });
        go('kyc');
      },
      goAsm: () => {
        if (!state.authed) {
          setState({
            authOpen: true,
            authMode: 'signup',
            authStage: 'form',
            pendingResume: 'asm',
          });
          return;
        }
        setState({ asmStep: 'elig' });
        go('asm');
      },
    };
  }, [state, setState, go]);
}

import { useMemo } from 'react';
import { useSessionState } from '@/hooks/useAppState';
import { FIELD } from '@/constants/tokens';
import type { AuthMethod } from '@/types';

/** Verification delay the design uses before the account becomes active. */
const VERIFY_MS = 950;

const segTab = (on: boolean) =>
  'position:relative; z-index:1; flex:1; padding:11px 0; border:none; background:none; cursor:pointer; font-size:14px; font-weight:800; transition:color .22s ease; color:' +
  (on ? '#fff' : '#6b7290') +
  ';';

const roleChip = (on: boolean) =>
  'padding:11px 16px; border-radius:11px; border:1px solid ' +
  (on ? '#1e2a5a' : '#dde2f0') +
  '; background:' +
  (on ? '#1e2a5a' : '#fff') +
  '; color:' +
  (on ? '#fff' : '#4a5170') +
  '; font-size:13px; font-weight:700; cursor:pointer; transition:all .18s ease;';

const authTab = (on: boolean) =>
  'flex:1; padding:12px; border:none; border-radius:9px; cursor:pointer; font-size:14px; font-weight:700; ' +
  (on ? 'background:#1e2a5a; color:#fff;' : 'background:transparent; color:#6b7290;');

/** View model for the sign-in / sign-up / OTP overlay. */
export function useAuthViewModel() {
  const {
    authed,
    authStage,
    authMethod,
    authMode,
    authRole,
    authOpen,
    authVerifying,
    setState,
  } = useSessionState();

  return useMemo(() => {
    const isSignup = authMode === 'signup';
    const isOtp = authStage === 'otp';

    const methods: { id: AuthMethod; label: string }[] = [
      { id: 'mobile', label: 'Mobile' },
      { id: 'email', label: 'Email' },
      { id: 'whatsapp', label: 'WhatsApp' },
    ];

    return {
      lbl: FIELD.lbl,
      inp: FIELD.inp,
      open: authOpen && !authed,
      showTabs: !isOtp,
      isLogin: !isSignup && !isOtp,
      isSignup: isSignup && !isOtp,
      isOtp,
      verifying: authVerifying,
      headline: isSignup
        ? 'Start trading assured minerals.'
        : 'Welcome back to Mineral Bridge.',
      blurb: isSignup
        ? 'Create an account to buy from our assured inventory, or sell your minerals to us with on-site verification.'
        : 'Sign in to complete purchases, list minerals and track every order through settlement.',
      perks: [
        { v: 'Escrow-protected settlement' },
        { v: 'KYC-verified counterparties' },
        { v: 'Full assay documentation' },
      ],
      target: authMethod === 'email' ? 'your email' : '+27 82 ••• 0000',
      loginTab: segTab(!isSignup),
      signupTab: segTab(isSignup),
      indicator:
        'position:absolute; top:5px; bottom:5px; width:calc(50% - 5px); border-radius:9px; background:#1e2a5a; transition:transform .28s cubic-bezier(.2,.8,.25,1); transform:translateX(' +
        (isSignup ? '100%' : '0') +
        ');',
      methods: methods.map((m) => ({
        id: m.id,
        label: m.label,
        style: authTab(authMethod === m.id),
        select: () => setState({ authMethod: m.id }),
      })),
      fieldLabel:
        authMethod === 'email'
          ? 'EMAIL ADDRESS'
          : authMethod === 'whatsapp'
            ? 'WHATSAPP NUMBER'
            : 'MOBILE NUMBER',
      isEmail: authMethod === 'email',
      roles: ['Buyer', 'Seller / miner', 'Both'].map((r) => ({
        label: r,
        style: roleChip(authRole === r),
        select: () => setState({ authRole: r }),
      })),
      otpBoxes: [0, 1, 2, 3].map((i) => ({
        i,
        val: i < 3 ? '5' : '',
        style:
          'width:60px; height:66px; border:1.6px solid ' +
          (i === 3 ? '#1e2a5a' : '#dde2f0') +
          '; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:26px; font-weight:800; color:#141a2e;',
      })),
      closeAuth: () => setState({ authOpen: false, authStage: 'form', authVerifying: false }),
      showLogin: () => setState({ authMode: 'login', authStage: 'form' }),
      showSignup: () => setState({ authMode: 'signup', authStage: 'form' }),
      sendOtp: () => setState({ authStage: 'otp' }),
      otpBack: () => setState({ authStage: 'form', authVerifying: false }),
      verifyOtp: () => {
        setState({ authVerifying: true });
        setTimeout(() => {
          setState((s) => {
            const base = {
              authed: true,
              authOpen: false,
              authVerifying: false,
              authStage: 'form' as const,
              pendingResume: null,
            };
            // New sign-ups go straight into KYC (skippable); returning users
            // resume whatever they were doing before signing in.
            if (s.authMode === 'signup' && s.kycStatus === 'unverified') {
              return {
                ...base,
                route: 'kyc' as const,
                kycStage: 'why' as const,
                kycReturn: s.pendingResume || 'home',
              };
            }
            return { ...base, route: s.pendingResume || s.route };
          });
        }, VERIFY_MS);
      },
    };
  }, [
    authed,
    authStage,
    authMethod,
    authMode,
    authRole,
    authOpen,
    authVerifying,
    setState,
  ]);
}

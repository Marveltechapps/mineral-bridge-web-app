import { useEffect, useMemo, useRef, useState } from 'react';
import { useSessionState } from '@/hooks/useAppState';
import { signIn } from '@/lib/auth/session';
import {
  formatAuthError,
  isApiConfigured,
  requestWebOtp,
  resendWebOtp,
  verifyWebOtp,
} from '@/features/auth/services/authService';
import { FIELD } from '@/constants/tokens';
import type { AuthMethod, KycStatus } from '@/types';

/** Verification delay the design uses before the account becomes active. */
const VERIFY_MS = 950;

function clock(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
}

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
  const [identifier, setIdentifier] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [digits, setDigits] = useState(['', '', '', '']);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [otpTarget, setOtpTarget] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);
  const [authError, setAuthError] = useState<string | null>(null);
  const sending = useRef(false);
  const api = isApiConfigured();

  useEffect(() => {
    if (!api || resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((current) => Math.max(0, current - 1)), 1000);
    return () => clearTimeout(timer);
  }, [api, resendIn]);

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
      target: otpTarget || (authMethod === 'email' ? 'your email' : 'your mobile number'),
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
      identifier,
      phone,
      email,
      fullName,
      authError,
      resendIn,
      resendHint: api ? clock(resendIn) : '02:58',
      setIdentifier,
      setPhone,
      setEmail,
      setFullName,
      otpBoxes: [0, 1, 2, 3].map((i) => ({
        i,
        val: api ? digits[i] : i < 3 ? '5' : '',
        onChange: (value: string) => {
          const next = value.replace(/\D/g, '').slice(-1);
          setDigits((prev) => prev.map((d, idx) => (idx === i ? next : d)));
        },
        style:
          'width:60px; height:66px; border:1.6px solid ' +
          (i === 3 ? '#1e2a5a' : '#dde2f0') +
          '; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:26px; font-weight:800; color:#141a2e;',
      })),
      closeAuth: () => setState({ authOpen: false, authStage: 'form', authVerifying: false }),
      showLogin: () => setState({ authMode: 'login', authStage: 'form' }),
      showSignup: () => setState({ authMode: 'signup', authStage: 'form' }),
      sendOtp: () => {
        if (!api) {
          setState({ authStage: 'otp' });
          return;
        }
        if (sending.current) return;
        const role = authRole.startsWith('Seller') ? 'seller' : authRole === 'Both' ? 'both' : 'buyer';
        const signup = authMode === 'signup';
        const name = fullName.trim();
        const phoneValue = phone.trim();
        const emailValue = email.trim();
        if (signup && name.length < 2) {
          setAuthError('Enter your full name');
          return;
        }
        if (signup && !phoneValue && !emailValue) {
          setAuthError('Enter a mobile number or email address');
          return;
        }
        if (!signup && !identifier.trim()) {
          setAuthError(authMethod === 'email' ? 'Enter a valid email address' : 'Enter a valid mobile number');
          return;
        }
        const method = signup ? (phoneValue ? 'mobile' : 'email') : authMethod;
        const destination = signup ? (phoneValue || emailValue) : identifier.trim();
        setAuthError(null);
        sending.current = true;
        void requestWebOtp({
          mode: signup ? 'signup' : 'login',
          method,
          identifier: destination,
          fullName: name,
          role,
          email: emailValue || undefined,
          mobile: phoneValue || undefined,
        })
          .then((challenge) => {
            if (!challenge.challengeId) {
              setAuthError('The server did not start verification');
              return;
            }
            setChallengeId(challenge.challengeId);
            setOtpTarget(challenge.target ?? null);
            setDigits(['', '', '', '']);
            setResendIn(challenge.resendAfter ?? 30);
            setState({ authStage: 'otp' });
          })
          .catch((error: unknown) => {
            setAuthError(formatAuthError(error, 'Could not send the code'));
          })
          .finally(() => {
            sending.current = false;
          });
      },
      resendOtp: () => {
        if (!api || !challengeId || resendIn > 0 || sending.current) return;
        sending.current = true;
        setAuthError(null);
        void resendWebOtp(challengeId)
          .then((challenge) => {
            setChallengeId(challenge.challengeId);
            setOtpTarget(challenge.target ?? otpTarget);
            setDigits(['', '', '', '']);
            setResendIn(challenge.resendAfter ?? 30);
          })
          .catch((error: unknown) => {
            setAuthError(formatAuthError(error, 'Could not resend the code'));
          })
          .finally(() => {
            sending.current = false;
          });
      },
      otpBack: () => setState({ authStage: 'form', authVerifying: false }),
      verifyOtp: () => {
        if (api) {
          if (!challengeId) {
            setAuthError('Request a code first');
            return;
          }
          setState({ authVerifying: true });
          void verifyWebOtp(challengeId, digits.join(''))
            .then((token) => {
              signIn(token);
              const kycStatus: KycStatus =
                token.kycStatus === 'pending' ? 'pending' : token.kycStatus === 'verified' ? 'verified' : 'unverified';
              setState((s) => {
                const base = {
                  authed: true,
                  authOpen: false,
                  authVerifying: false,
                  authStage: 'form' as const,
                  pendingResume: null,
                  kycStatus,
                  accForm: {
                    ...s.accForm,
                    name: token.user?.fullName || s.accForm.name,
                    email: token.user?.email || s.accForm.email,
                    mobile: token.user?.mobile || s.accForm.mobile,
                    country: token.user?.countryName || s.accForm.country,
                    company: token.user?.companyName || s.accForm.company,
                  },
                };
                if (s.authMode === 'signup' && kycStatus === 'unverified') {
                  return { ...base, route: 'kyc' as const, kycStage: 'why' as const, kycReturn: s.pendingResume || 'home' };
                }
                return { ...base, route: s.pendingResume || s.route };
              });
            })
            .catch((error: unknown) => {
              setState({ authVerifying: false });
              setAuthError(formatAuthError(error, 'That code was not accepted'));
            });
          return;
        }
        setState({ authVerifying: true });
        setTimeout(() => {
          // Begins the session the rest of the application reads from. With no
          // backend there is no credential, so this is a `demo` session and
          // nothing is sent as a bearer token. When `POST /auth/otp` exists,
          // pass its TokenResponse here and the session becomes authenticated
          // with no other change needed.
          signIn();
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
    api,
    identifier,
    phone,
    email,
    fullName,
    digits,
    challengeId,
    otpTarget,
    resendIn,
    authError,
  ]);
}

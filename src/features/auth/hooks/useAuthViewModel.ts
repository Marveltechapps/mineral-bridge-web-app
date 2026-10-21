import { useEffect, useMemo, useRef, useState } from 'react';
import { useSessionState } from '@/hooks/useAppState';
import { signIn } from '@/lib/auth/session';
import {
  applyPhoneInput,
  detectDialCountry,
  formatNational,
  nationalDigits,
  prepareLogin,
  prepareSignup,
  signupChannels,
  type DialCountryCode,
  type SignupChannel,
  type SignupDraft,
} from '@/features/auth/phone';
import {
  fetchDevLoginStatus,
  fetchVerificationOptions,
  formatAuthError,
  isAccountMissing,
  isApiConfigured,
  isDeliveryFailure,
  requestWebOtp,
  resendWebOtp,
  startDevLogin,
  verifyDevLogin,
  verifyWebOtp,
  visibleDevelopmentOtp,
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
  const [loginEmail, setLoginEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [dialCountry, setDialCountry] = useState<DialCountryCode>(() => detectDialCountry());
  const [rememberDevice, setRememberDevice] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [digits, setDigits] = useState(['', '', '', '']);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [otpTarget, setOtpTarget] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);
  const [authError, setAuthError] = useState<string | null>(null);
  const [accountMissing, setAccountMissing] = useState(false);
  const [signupDraft, setSignupDraft] = useState<SignupDraft | null>(null);
  const [providers, setProviders] = useState({ email: true, sms: true });
  const [providersReady, setProvidersReady] = useState(false);
  const [optionsAttempt, setOptionsAttempt] = useState(0);
  const [devLoginAvailable, setDevLoginAvailable] = useState(false);
  const [devMode, setDevMode] = useState(false);
  const [devPassword, setDevPassword] = useState('');
  const [developmentOtp, setDevelopmentOtp] = useState<string | null>(null);
  const [devDigits, setDevDigits] = useState(['', '', '', '', '', '']);
  const sending = useRef(false);
  const api = isApiConfigured();

  useEffect(() => {
    if (!api || authStage !== 'verify-method') return;
    let cancelled = false;
    setProvidersReady(false);
    void fetchVerificationOptions()
      .then((options) => {
        if (!cancelled) setProviders({ email: Boolean(options.email), sms: Boolean(options.sms) });
      })
      .catch(() => {
        if (!cancelled) setProviders({ email: true, sms: true });
      })
      .finally(() => {
        if (!cancelled) setProvidersReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [api, authStage, optionsAttempt]);

  useEffect(() => {
    if (!api) return;
    let cancelled = false;
    void fetchDevLoginStatus()
      .then((status) => {
        if (!cancelled) setDevLoginAvailable(status.enabled === true);
      })
      .catch(() => {
        if (!cancelled) setDevLoginAvailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, [api]);

  useEffect(() => {
    if (!api || resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((current) => Math.max(0, current - 1)), 1000);
    return () => clearTimeout(timer);
  }, [api, resendIn]);

  return useMemo(() => {
    const developer = devMode && devLoginAvailable;
    const isSignup = authMode === 'signup';
    const codeDigits = developer ? devDigits : digits;
    const isOtp = authStage === 'otp';
    const isVerifyMethod = authStage === 'verify-method' && isSignup;
    const draft = signupDraft;
    const channelChoices = draft ? signupChannels(draft, api ? providers : { email: Boolean(draft.email), sms: Boolean(draft.mobile) }) : [];

    const methods: { id: AuthMethod; label: string }[] = [
      { id: 'mobile', label: 'Mobile' },
      { id: 'email', label: 'Email' },
      { id: 'whatsapp', label: 'WhatsApp' },
    ];

    return {
      lbl: FIELD.lbl,
      inp: FIELD.inp,
      open: authOpen && !authed,
      showTabs: authStage === 'form',
      isLogin: !isSignup && authStage === 'form' && !developer,
      isDevLogin: developer && !isSignup && authStage === 'form',
      isDeveloperOtp: developer && isOtp,
      isSignup: isSignup && authStage === 'form',
      inSignup: isSignup,
      isVerifyMethod,
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
      otpNotice: developmentOtp
        ? 'Development-only code. It was not sent by email or SMS. Type it below, then verify.'
        : !api
          ? 'This screen is a preview. A code is sent only after the API accepts it.'
          : isSignup
            ? `A 4-digit code was sent to ${otpTarget || (authMethod === 'email' ? 'your email' : 'your mobile number')}. It can take a minute to arrive.`
            : `A 4-digit code was sent to ${otpTarget || (authMethod === 'email' ? 'your email' : 'your mobile number')}.`,
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
      phone,
      email,
      loginEmail,
      devLoginAvailable,
      devPassword,
      developmentOtp,
      setDevPassword: (value: string) => {
        setDevPassword(value);
        setAuthError(null);
      },
      fullName,
      dialCountry,
      rememberDevice,
      submitting,
      authError,
      accountMissing,
      resendIn,
      providersReady: !api || providersReady,
      verificationChoices: channelChoices.map((id) => ({
        id,
        label: id === 'email' ? 'Verify using Email OTP' : 'Verify using SMS OTP',
        detail: id === 'email' ? draft?.email : draft?.mobile,
      })),
      verificationUnavailable: Boolean(draft) && providersReady && channelChoices.length === 0,
      resendHint: api ? clock(resendIn) : '02:58',
      setLoginEmail: (value: string) => {
        setLoginEmail(value);
        setAuthError(null);
        setAccountMissing(false);
      },
      setEmail,
      setFullName,
      changeCountry: (iso: DialCountryCode) => {
        setDialCountry(iso);
        setPhone((current) => formatNational(iso, nationalDigits(current)));
        setAuthError(null);
      },
      changePhone: (raw: string) => {
        const next = applyPhoneInput(raw, dialCountry);
        if (next.country && next.country !== dialCountry) setDialCountry(next.country);
        setPhone(next.national);
        setAuthError(null);
        setAccountMissing(false);
      },
      toggleRemember: () => setRememberDevice((current) => !current),
      otpBoxes: codeDigits.map((val, i) => ({
        i,
        val: val ?? '',
        onChange: (value: string) => {
          const next = value.replace(/\D/g, '').slice(-1);
          const update = (prev: string[]) => prev.map((d, idx) => (idx === i ? next : d));
          if (developer) setDevDigits(update);
          else setDigits(update);
        },
        style:
          'width:' +
          (codeDigits.length > 4 ? '46px' : '60px') +
          '; height:66px; border:1.6px solid ' +
          (i === codeDigits.length - 1 ? '#1e2a5a' : '#dde2f0') +
          '; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:26px; font-weight:800; color:#141a2e;',
      })),
      closeAuth: () => setState({ authOpen: false, authStage: 'form', authVerifying: false }),
      showLogin: () => {
        setAccountMissing(false);
        setAuthError(null);
        setDevMode(false);
        setDevelopmentOtp(null);
        setDevPassword('');
        setState({ authMode: 'login', authStage: 'form' });
      },
      showDeveloperLogin: () => {
        setAccountMissing(false);
        setAuthError(null);
        setDevMode(true);
        setDevelopmentOtp(null);
        setDevDigits(['', '', '', '', '', '']);
        setState({ authMode: 'login', authStage: 'form' });
      },
      showSignup: () => {
        setAccountMissing(false);
        setAuthError(null);
        setDevMode(false);
        setDevelopmentOtp(null);
        setDevPassword('');
        setState({ authMode: 'signup', authStage: 'form' });
      },
      createAccount: () => {
        setAccountMissing(false);
        setAuthError(null);
        setState({ authMode: 'signup', authStage: 'form', authVerifying: false });
      },
      sendOtp: () => {
        setAccountMissing(false);
        if (authMode === 'signup') {
          const prepared = prepareSignup({ fullName, phone, email, country: dialCountry });
          if (!prepared.ok) {
            setAuthError(prepared.error);
            return;
          }
          setSignupDraft(prepared);
          setAuthError(null);
          setState({ authStage: 'verify-method', authMethod: prepared.email ? 'email' : 'mobile' });
          return;
        }
        if (!api) {
          setState({ authStage: 'otp' });
          return;
        }
        if (sending.current) return;
        const role = authRole.startsWith('Seller') ? 'seller' : authRole === 'Both' ? 'both' : 'buyer';
        const prepared = prepareLogin({ method: authMethod, phone, email: loginEmail, country: dialCountry });
        if (!prepared.ok) {
          setAuthError(prepared.error);
          return;
        }
        setAuthError(null);
        sending.current = true;
        setSubmitting(true);
        void requestWebOtp({
          mode: 'login',
          method: authMethod,
          identifier: prepared.identifier,
          fullName: fullName.trim(),
          role,
          country: dialCountry,
        })
          .then((challenge) => {
            if (!challenge.challengeId) {
              setAuthError('The server did not start verification');
              return;
            }
            setChallengeId(challenge.challengeId);
            setOtpTarget(challenge.target ?? null);
            const localCode = visibleDevelopmentOtp(challenge);
            setDevelopmentOtp(localCode);
            setDigits(Array(localCode ? 6 : 4).fill(''));
            setResendIn(challenge.resendAfter ?? 30);
            setState({ authStage: 'otp' });
          })
          .catch((error: unknown) => {
            setAccountMissing(isAccountMissing(error));
            setAuthError(formatAuthError(error, 'Could not send the code'));
          })
          .finally(() => {
            sending.current = false;
            setSubmitting(false);
          });
      },
      chooseVerification: (method: SignupChannel) => {
        const prepared = signupDraft;
        if (!prepared) {
          setState({ authStage: 'form' });
          return;
        }
        if (!api) {
          setState({ authMethod: method, authStage: 'otp' });
          return;
        }
        if (sending.current) return;
        const role = authRole.startsWith('Seller') ? 'seller' : authRole === 'Both' ? 'both' : 'buyer';
        const identifier = method === 'email' ? prepared.email : prepared.mobile;
        if (!identifier) {
          setAuthError(method === 'email' ? 'Enter an email address to use email verification' : 'Enter a mobile number to use SMS verification');
          return;
        }
        setAuthError(null);
        setAccountMissing(false);
        sending.current = true;
        setSubmitting(true);
        void requestWebOtp({
          mode: 'signup',
          method,
          identifier,
          fullName: prepared.fullName,
          role,
          country: prepared.country,
          email: prepared.email,
          mobile: prepared.mobile,
        })
          .then((challenge) => {
            if (!challenge.challengeId) {
              setAuthError('The server did not start verification');
              return;
            }
            setChallengeId(challenge.challengeId);
            setOtpTarget(challenge.target ?? null);
            const localCode = visibleDevelopmentOtp(challenge);
            setDevelopmentOtp(localCode);
            setDigits(Array(localCode ? 6 : 4).fill(''));
            setResendIn(challenge.resendAfter ?? 30);
            setState({ authMethod: method, authStage: 'otp' });
          })
          .catch((error: unknown) => {
            setAuthError(formatAuthError(error, 'Could not send the code'));
            if (isDeliveryFailure(error)) setState({ authStage: 'verify-method' });
          })
          .finally(() => {
            sending.current = false;
            setSubmitting(false);
          });
      },
      retryVerificationOptions: () => setOptionsAttempt((current) => current + 1),
      resendOtp: () => {
        if (!api || !challengeId || resendIn > 0 || sending.current) return;
        sending.current = true;
        setAuthError(null);
        void resendWebOtp(challengeId)
          .then((challenge) => {
            setChallengeId(challenge.challengeId);
            setOtpTarget(challenge.target ?? otpTarget);
            const localCode = visibleDevelopmentOtp(challenge);
            setDevelopmentOtp(localCode);
            setDigits(Array(localCode ? 6 : 4).fill(''));
            setResendIn(challenge.resendAfter ?? 30);
          })
          .catch((error: unknown) => {
            setAuthError(formatAuthError(error, 'Could not resend the code'));
          })
          .finally(() => {
            sending.current = false;
          });
      },
      otpBack: () => {
        setDevelopmentOtp(null);
        setState({
          authStage: authMode === 'signup' ? 'verify-method' : 'form',
          authVerifying: false,
        });
      },
      startDeveloperLogin: () => {
        if (!developer || sending.current) return;
        if (!loginEmail.trim() || !devPassword) {
          setAuthError('Enter the developer email and password.');
          return;
        }
        setAuthError(null);
        sending.current = true;
        setSubmitting(true);
        const password = devPassword;
        setDevPassword('');
        void startDevLogin(loginEmail.trim(), password)
          .then((challenge) => {
            if (!challenge.challengeId || !challenge.developmentOtp) {
              setAuthError('The server did not start development login');
              return;
            }
            setChallengeId(challenge.challengeId);
            setDevelopmentOtp(challenge.developmentOtp);
            setDevDigits(['', '', '', '', '', '']);
            setState({ authStage: 'otp' });
          })
          .catch((error: unknown) => {
            setAuthError(formatAuthError(error, 'Development login is not available'));
          })
          .finally(() => {
            sending.current = false;
            setSubmitting(false);
          });
      },
      verifyOtp: () => {
        if (api && developer) {
          if (sending.current) return;
          if (!challengeId) {
            setAuthError('Request a code first');
            return;
          }
          const code = devDigits.join('');
          if (!/^\d{6}$/.test(code)) {
            setAuthError('Enter the 6-digit development code');
            return;
          }
          sending.current = true;
          setState({ authVerifying: true });
          void verifyDevLogin(challengeId, code, rememberDevice)
            .then((token) => {
              setDevelopmentOtp(null);
              setDevPassword('');
              setDevMode(false);
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
                if (s.pendingResume) return { ...base, route: s.pendingResume };
                return { ...base, route: s.route === 'auth' ? 'home' : s.route };
              });
            })
            .catch((error: unknown) => {
              setState({ authVerifying: false });
              setAuthError(formatAuthError(error, 'That code was not accepted'));
            })
            .finally(() => {
              sending.current = false;
            });
          return;
        }
        if (api) {
          if (sending.current) return;
          if (!challengeId) {
            setAuthError('Request a code first');
            return;
          }
          const code = digits.join('');
          const expected = developmentOtp ? 6 : 4;
          if (code.length !== expected || !/^\d+$/.test(code)) {
            setAuthError(expected === 6 ? 'Enter the 6-digit development code' : 'Enter the 4-digit code');
            return;
          }
          sending.current = true;
          setState({ authVerifying: true });
          void verifyWebOtp(challengeId, code, rememberDevice)
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
                if (s.pendingResume) {
                  return { ...base, route: s.pendingResume };
                }
                if (s.authMode === 'signup' && kycStatus === 'unverified') {
                  return { ...base, route: 'kyc' as const, kycStage: 'why' as const, kycReturn: 'home' as const };
                }
                return { ...base, route: s.route === 'auth' ? 'home' : s.route };
              });
            })
            .catch((error: unknown) => {
              setState({ authVerifying: false });
              setAuthError(formatAuthError(error, 'That code was not accepted'));
            })
            .finally(() => {
              sending.current = false;
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
            if (s.pendingResume) {
              return { ...base, route: s.pendingResume };
            }
            if (s.authMode === 'signup' && s.kycStatus === 'unverified') {
              return {
                ...base,
                route: 'kyc' as const,
                kycStage: 'why' as const,
                kycReturn: 'home' as const,
              };
            }
            return { ...base, route: s.route };
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
    phone,
    email,
    loginEmail,
    fullName,
    dialCountry,
    rememberDevice,
    submitting,
    digits,
    devDigits,
    devMode,
    devLoginAvailable,
    devPassword,
    developmentOtp,
    challengeId,
    otpTarget,
    resendIn,
    authError,
    accountMissing,
    signupDraft,
    providers,
    providersReady,
    optionsAttempt,
  ]);
}

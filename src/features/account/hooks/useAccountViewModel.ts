import { useMemo } from 'react';
import { useAccountState, useKycState, useSessionState } from '@/hooks/useAppState';
import { useActions } from '@/hooks/useActions';
import type { IconName } from '@/types';

/** One row of the account panel. Exactly one `is*` flag is set. */
export interface AccountRow {
  label: string;
  sub?: string;
  value?: string;
  isText?: boolean;
  isBadge?: boolean;
  isAction?: boolean;
  isToggle?: boolean;
  badgeStyle?: string;
  toggleStyle?: string;
  knobStyle?: string;
  action?: () => void;
}

const ACC_NAV: { k: string; label: string; ic: IconName }[] = [
  { k: 'profile', label: 'Profile', ic: 'shield' },
  { k: 'documents', label: 'Documents & KYC', ic: 'flask' },
  { k: 'payouts', label: 'Payout methods', ic: 'chain' },
  { k: 'security', label: 'Security', ic: 'shield' },
  { k: 'support', label: 'Help & support', ic: 'truck' },
];

const BADGE_COLORS: Record<string, [string, string]> = {
  Verified: ['#0f7034', '#dcf3e8'],
  Pending: ['#8a3f07', '#fdecd6'],
  Primary: ['#1d4ed8', '#dbeafe'],
};

/** View model for the account screen's navigation and panels. */
export function useAccountViewModel() {
  const {
    accountTab,
    accForm,
    accSaved,
    accToggles,
    accPayouts,
    accDocSubmitted,
    setState,
    go,
  } = useAccountState();
  const { authed } = useSessionState();
  const { kycStatus } = useKycState();
  const h = useActions();

  return useMemo(() => {
    const sheet = (title: string, body: string, label?: string) =>
      setState({
        modal: {
          title,
          body,
          confirmLabel: label || 'Done',
          confirm: () => setState({ modal: null }),
        },
      });

    const tog = (k: string, label: string, sub: string): AccountRow => {
      const on = !!accToggles[k];
      return {
        label,
        sub,
        isToggle: true,
        toggleStyle:
          'width:48px; height:28px; border-radius:14px; padding:3px; display:flex; border:none; cursor:pointer; flex-shrink:0; background:' +
          (on ? '#16a34a' : '#cdd4e6') +
          '; justify-content:' +
          (on ? 'flex-end' : 'flex-start') +
          ';',
        knobStyle: 'width:22px; height:22px; border-radius:11px; background:#fff; display:block;',
        action: () =>
          setState((s) => ({ accToggles: { ...s.accToggles, [k]: !s.accToggles[k] } })),
      };
    };

    const badge = (label: string, sub: string, value: string): AccountRow => {
      const c = BADGE_COLORS[value] || ['#6b7290', '#eef1f8'];
      return {
        label,
        sub,
        value,
        isBadge: true,
        badgeStyle:
          'font-size:11.5px; font-weight:800; padding:6px 13px; border-radius:9px; white-space:nowrap; color:' +
          c[0] +
          '; background:' +
          c[1] +
          ';',
      };
    };

    const act = (label: string, sub: string, value: string, fn: () => void): AccountRow => ({
      label,
      sub,
      value,
      isAction: true,
      action: fn,
    });

    const txt = (label: string, value: string, sub?: string): AccountRow => ({
      label,
      sub,
      value,
      isText: true,
    });

    const shown = accSaved || accForm;
    const kycStatusSub =
      kycStatus === 'verified'
        ? 'Verified — full trading access'
        : kycStatus === 'pending'
          ? 'Submitted — under compliance review'
          : 'Not started — required to trade';
    const kycStatusCta =
      kycStatus === 'verified'
        ? 'View'
        : kycStatus === 'pending'
          ? 'View status'
          : 'Verify now';

    const extraPayouts = (accPayouts || []).map((p) =>
      badge(p.type, p.ref ? '••• ' + String(p.ref).slice(-4) : 'Linked', p.def ? 'Primary' : 'Verified'),
    );

    const accData: Record<string, [string, AccountRow[], string, boolean]> = {
      profile: [
        'Profile',
        [
          txt('Full name', shown.name, 'Locked to your KYC record'),
          txt('Email', shown.email, 'Used for order confirmations'),
          txt('Mobile', shown.mobile),
          txt('Company', shown.company),
          txt('Country', shown.country),
          txt('Account type', shown.role),
        ],
        'Edit profile',
        false,
      ],
      documents: [
        'Documents & KYC',
        [
          act('Identity verification (KYC)', kycStatusSub, kycStatusCta, () => go('kyc')),
          badge('Company registration', 'Certificate of incorporation', 'Pending'),
          accDocSubmitted
            ? badge('Mining licence', 'Submitted for compliance review', 'Pending')
            : act('Mining licence', 'Required to sell as a licensed operation', 'Upload', () =>
                h.openAccEdit('doc'),
              ),
          badge('Proof of address', 'Utility bill or bank statement', 'Verified'),
          act('Tax certificate', 'Optional — speeds up settlement', 'Upload', () =>
            h.openAccEdit('doc'),
          ),
        ],
        'Upload a document',
        false,
      ],
      payouts: [
        'Payout methods',
        [
          badge('Escrow wallet', 'Smart-contract secured · USDC', 'Primary'),
          badge('Corporate bank · SWIFT', 'Standard Bank ···· 4471', 'Verified'),
          act('Mobile money', 'Not added', 'Add', () => h.openAccEdit('payout')),
          act('Crypto wallet', 'Not added', 'Add', () => h.openAccEdit('payout')),
        ].concat(extraPayouts),
        'Add payout method',
        false,
      ],
      security: [
        'Security',
        [
          tog('twofa', 'Two-factor authentication', 'OTP on every sign-in'),
          tog('bio', 'Biometric login', 'Face / fingerprint unlock'),
          tog('alerts', 'Login alerts', 'Notify on new device'),
          tog('ledger', 'Ledger visibility', 'Share verified trade history with buyers'),
          act('Active sessions', '3 devices signed in', 'Manage', () => h.openAccEdit('sessions')),
          act('Change password', 'Last changed 3 months ago', 'Change', () =>
            h.openAccEdit('password'),
          ),
        ],
        'Save security settings',
        true,
      ],
      support: [
        'Help & support',
        [
          act('Live chat', 'Agents online now', 'Open chat', () =>
            sheet('Live chat', 'An agent is joining — average wait is under 2 minutes.', 'Got it'),
          ),
          act('Email support', 'Reply within 4 hours', 'Contact', () =>
            sheet(
              'Email support',
              'Write to support@mineralbridge.com and quote your order reference for a faster reply.',
              'Got it',
            ),
          ),
          act('Priority callback', 'Institutional accounts only', 'Request', () =>
            sheet('Callback requested', 'Our desk will call you on +27 82 445 1120 within the hour.', 'Done'),
          ),
          act('How it works', 'Buying, selling, assay and escrow explained', 'Watch', () =>
            go('howItWorks'),
          ),
          act('FAQ', 'Common questions answered', 'Browse', () =>
            sheet(
              'FAQ',
              'Escrow, assay timelines, fees and KYC requirements are covered in our help centre.',
              'Got it',
            ),
          ),
        ],
        'Contact the desk',
        false,
      ],
    };

    const accActive = accData[accountTab] || accData.profile;

    return {
      accountNav: ACC_NAV.map((a) => ({
        k: a.k,
        label: a.label,
        ic: a.ic,
        style:
          'display:flex; align-items:center; gap:12px; width:100%; padding:13px 14px; border:none; border-radius:12px; cursor:pointer; font-size:14.5px; font-weight:700; background:' +
          (accountTab === a.k ? '#eef1fb' : 'transparent') +
          '; color:' +
          (accountTab === a.k ? '#1e2a5a' : '#6b7290') +
          ';',
        select: () => setState({ accountTab: a.k }),
      })),
      accountTitle: accActive[0],
      accountRows: accActive[1],
      accountFooter: authed,
      accountPrimaryLabel: accActive[2],
      accountHasDanger: accActive[3],
      notAuthed: !authed,
      accountPrimary: () => {
        const tab = accountTab;
        const route: Record<string, string> = {
          profile: 'profile',
          documents: 'doc',
          payouts: 'payout',
        };
        if (route[tab]) {
          h.openAccEdit(route[tab]);
          return;
        }
        if (tab === 'support') {
          setState({
            modal: {
              title: 'Live chat',
              body: 'An agent is joining — average wait is under 2 minutes. You can also email support@mineralbridge.com quoting your order reference.',
              confirmLabel: 'Got it',
              confirm: () => setState({ modal: null }),
            },
          });
          return;
        }
        setState({
          modal: {
            title: 'Security settings saved',
            body: 'Your preferences have been applied to this account.',
            confirmLabel: 'Done',
            confirm: () => setState({ modal: null }),
          },
        });
      },
      confirmLogout: () =>
        setState({
          modal: {
            title: 'Log out?',
            body: 'You will need to sign in again to trade or manage your account.',
            confirmLabel: 'Log out',
            confirm: () => setState({ authed: false, modal: null, route: 'home' }),
          },
        }),
      confirmDelete: () =>
        setState({
          modal: {
            title: 'Delete account?',
            body: 'This permanently removes your profile, documents and payout methods. Open orders must settle first. This cannot be undone.',
            confirmLabel: 'Delete account',
            confirm: () => setState({ authed: false, modal: null, route: 'home' }),
          },
        }),
    };
  }, [
    accountTab,
    accForm,
    accSaved,
    accToggles,
    accPayouts,
    accDocSubmitted,
    authed,
    kycStatus,
    setState,
    go,
    h,
  ]);
}

import { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAccountState, useSessionState } from '@/hooks/useAppState';
import { FIELD } from '@/constants/tokens';
import { http } from '@/lib/api/client';
import { isApiConfigured } from '@/lib/api/config';
import { pickFile, uploadFile } from '@/lib/api/uploads';

const pill2 = (on: boolean) =>
  'padding:11px 18px; border-radius:11px; border:1px solid ' +
  (on ? '#1e2a5a' : '#dde2f0') +
  '; background:' +
  (on ? '#1e2a5a' : '#fff') +
  '; color:' +
  (on ? '#fff' : '#4a5170') +
  '; font-size:13.5px; font-weight:700; cursor:pointer;';

const TITLES: Record<string, [string, string]> = {
  profile: ['Edit profile', 'Update the details shown on your account and orders.'],
  doc: ['Upload document', 'Add a document for compliance review.'],
  payout: ['Add payout method', 'Where we send your settlement funds.'],
  password: ['Change password', 'Choose a strong password you have not used before.'],
  sessions: ['Active sessions', 'Devices currently signed in to your account.'],
};

const SAVE_LABELS: Record<string, string> = {
  profile: 'Save changes',
  doc: 'Submit for review',
  payout: 'Link method',
  password: 'Update password',
  sessions: 'Done',
};

const SESSION_DEFS = [
  { id: 's1', device: 'Chrome on macOS', meta: 'Cape Town, ZA · active now', current: true },
  {
    id: 's2',
    device: 'Mineral Bridge mobile',
    meta: 'Johannesburg, ZA · 2 hours ago',
    current: false,
  },
  { id: 's3', device: 'Safari on iPad', meta: 'Nairobi, KE · 3 days ago', current: false },
];

/** Password strength bands: [colour, label, bar width]. */
const PW_META: [string, string, string][] = [
  ['#dc2626', 'Too weak', '18%'],
  ['#b45309', 'Getting there', '45%'],
  ['#2563eb', 'Good', '72%'],
  ['#16a34a', 'Strong', '100%'],
];

/** View model for the account edit sheets (profile, doc, payout, password, sessions). */
export function useAccountEditViewModel() {
  const {
    accEditKind,
    accForm,
    accDocName,
    accDocUploaded,
    accPayType,
    accPayNetwork,
    accRevoked,
    setState,
    go,
  } = useAccountState();
  const { authed } = useSessionState();
  const api = isApiConfigured();
  const client = useQueryClient();
  const sessionsQuery = useQuery({
    queryKey: ['account', 'sessions'],
    queryFn: ({ signal }) =>
      http.get<{ items: Array<{ id: string; device: string; location: string; lastActiveAt: string; isCurrent: boolean }> }>(
        '/auth/sessions',
        { signal },
      ),
    enabled: api && authed && accEditKind === 'sessions',
  });

  return useMemo(() => {
    const ak = accEditKind;
    const af = accForm;
    const titles = TITLES[ak] || ['Edit', ''];

    const pwLen = (af.pw || '').length;
    const pwScore = Math.min(
      3,
      (pwLen >= 10 ? 1 : 0) +
        (/[A-Z]/.test(af.pw || '') ? 1 : 0) +
        (/[0-9!@#$%^&*]/.test(af.pw || '') ? 1 : 0),
    );
    const pwMeta = PW_META[pwLen ? pwScore : 0];

    const payIsCrypto = accPayType === 'Crypto wallet';
    const payIsBank = accPayType === 'Bank transfer';

    const sessionSource = api
      ? (sessionsQuery.data?.items ?? []).map((s) => ({
          id: s.id,
          device: s.device,
          meta: `${s.location} · ${new Date(s.lastActiveAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}`,
          current: s.isCurrent,
        }))
      : SESSION_DEFS;
    const sessions = sessionSource.filter((s) => !accRevoked[s.id]);

    const saveOk =
      ak === 'profile'
        ? !!(af.email || '').trim()
        : ak === 'doc'
          ? accDocUploaded
          : ak === 'payout'
            ? !!(af.payAccount || '').trim()
            : ak === 'password'
              ? pwLen >= 10
              : true;

    const setAcc = (k: keyof typeof af, v: string | boolean) =>
      setState((s) => ({ accForm: { ...s.accForm, [k]: v } }));

    const acc = {
      title: titles[0],
      sub: titles[1],
      isProfile: ak === 'profile',
      isDoc: ak === 'doc',
      isPayout: ak === 'payout',
      isPassword: ak === 'password',
      isSessions: ak === 'sessions',
      f: af,
      initials: 'MT',
      roles: ['Buyer', 'Seller / miner', 'Both'].map((r) => ({
        label: r,
        style: pill2(af.role === r),
        select: () => setAcc('role', r),
      })),
      docUploaded: accDocUploaded,
      docPending: !accDocUploaded,
      docFile: accDocName || 'document.pdf',
      docCta: accDocUploaded ? 'Replace file' : 'Choose file',
      payTypes: ['Bank transfer', 'Mobile money', 'Crypto wallet'].map((p) => ({
        label: p,
        style: pill2(accPayType === p),
        select: () => setState({ accPayType: p }),
      })),
      payIsCrypto,
      payIsBank,
      payFieldLabel: payIsCrypto
        ? 'Wallet address'
        : payIsBank
          ? 'Account number'
          : 'Mobile money number',
      payPlaceholder: payIsCrypto ? '0x…' : payIsBank ? '0000000000' : '+27 82 000 0000',
      networks: ['TRC-20', 'ERC-20', 'BEP-20'].map((n) => ({
        label: n,
        style: pill2(accPayNetwork === n),
        select: () => setState({ accPayNetwork: n }),
      })),
      defaultBox:
        'width:22px; height:22px; border-radius:6px; border:1.6px solid #1e2a5a; background:' +
        (af.payDefault ? '#1e2a5a' : '#fff') +
        '; display:flex; align-items:center; justify-content:center; flex-shrink:0; cursor:pointer;',
      pwPct: pwMeta[2],
      pwColor: pwMeta[0],
      pwLabel: pwLen ? 'Password strength: ' + pwMeta[1] : 'Enter a new password',
      pwRules: [
        { v: 'At least 10 characters', ok: pwLen >= 10 },
        { v: 'One uppercase letter', ok: /[A-Z]/.test(af.pw || '') },
        { v: 'One number or symbol', ok: /[0-9!@#$%^&*]/.test(af.pw || '') },
      ].map((r) => ({
        v: r.v,
        color: r.ok ? '#16a34a' : '#5b638a',
        bg: r.ok ? '#16a34a' : '#cdd4e6',
      })),
      sessions: sessions.map((s) => ({
        id: s.id,
        device: s.device,
        meta: s.meta,
        current: s.current,
        other: !s.current,
        revoke: () => {
          setState((x) => ({ accRevoked: { ...x.accRevoked, [s.id]: true } }));
          if (api) {
            void http.delete(`/auth/sessions/${encodeURIComponent(s.id)}`).then(() => client.invalidateQueries({ queryKey: ['account', 'sessions'] }));
          }
        },
      })),
      saveLabel: SAVE_LABELS[ak] || 'Save',
      saveBlocked: !saveOk,
      saveStyle:
        'height:54px; padding:0 32px; border:none; border-radius:13px; font-size:15.5px; font-weight:800; background:' +
        (saveOk ? '#1e2a5a' : '#eef1f8') +
        '; color:' +
        (saveOk ? '#fff' : '#5b638a') +
        '; cursor:' +
        (saveOk ? 'pointer' : 'not-allowed') +
        ';',
    };

    return {
      lbl: FIELD.lbl,
      inp: FIELD.inp,
      acc,
      accEmail: (e: React.ChangeEvent<HTMLInputElement>) => setAcc('email', e.target.value),
      accMobile: (e: React.ChangeEvent<HTMLInputElement>) => setAcc('mobile', e.target.value),
      accCountry: (e: React.ChangeEvent<HTMLInputElement>) => setAcc('country', e.target.value),
      accCompany: (e: React.ChangeEvent<HTMLInputElement>) => setAcc('company', e.target.value),
      accDocRef: (e: React.ChangeEvent<HTMLInputElement>) => setAcc('docRef', e.target.value),
      accDocExp: (e: React.ChangeEvent<HTMLInputElement>) => setAcc('docExp', e.target.value),
      accPayAccount: (e: React.ChangeEvent<HTMLInputElement>) =>
        setAcc('payAccount', e.target.value),
      accPayBank: (e: React.ChangeEvent<HTMLInputElement>) => setAcc('payBank', e.target.value),
      accPaySwift: (e: React.ChangeEvent<HTMLInputElement>) => setAcc('paySwift', e.target.value),
      accPw: (e: React.ChangeEvent<HTMLInputElement>) => setAcc('pw', e.target.value),
      accPayDefault: () =>
        setState((s) => ({ accForm: { ...s.accForm, payDefault: !s.accForm.payDefault } })),
      accPhoto: () =>
        setState({
          modal: {
            title: 'Photo updated',
            body: 'Your new profile photo has been saved.',
            confirmLabel: 'Done',
            confirm: () => setState({ modal: null }),
          },
        }),
      accDocPick: () => {
        if (!api) {
          setState({ accDocUploaded: true, accDocName: 'mining-licence-2026.pdf' });
          return;
        }
        void pickFile('image/jpeg,image/png,image/webp,application/pdf').then(async (file) => {
          if (!file) return;
          try {
            const fileId = await uploadFile(file, 'document');
            await http.post('/account/documents', { name: file.name, kind: 'other', fileId });
            setState({ accDocUploaded: true, accDocName: file.name });
            await client.invalidateQueries({ queryKey: ['account', 'documents'] });
          } catch (error: unknown) {
            setState({
              modal: {
                title: 'Document was not uploaded',
                body: error instanceof Error ? error.message : 'The document was rejected.',
                confirmLabel: 'Close',
                confirm: () => setState({ modal: null }),
              },
            });
          }
        });
      },
      accSave: () => {
        const k = accEditKind;
        const finish = (title: string, body: string) =>
          setState({
            modal: {
              title,
              body,
              confirmLabel: 'Done',
              confirm: () => {
                setState({ modal: null });
                go('account');
              },
            },
          });
        const fail = (error: unknown) =>
          setState({
            modal: {
              title: 'Changes were not saved',
              body: error instanceof Error ? error.message : 'The server rejected the update.',
              confirmLabel: 'Close',
              confirm: () => setState({ modal: null }),
            },
          });
        if (api && k === 'profile') {
          const country = accForm.country.trim();
          void http
            .patch('/account/profile', {
              fullName: accForm.name,
              email: accForm.email || null,
              phone: accForm.mobile,
              companyName: accForm.company || null,
              ...(country.length === 2 ? { countryCode: country.toUpperCase() } : {}),
            })
            .then(() => {
              setState({ accSaved: { ...accForm } });
              finish('Profile updated', 'Your account details have been saved.');
            })
            .catch(fail);
          return;
        }
        if (api && k === 'payout') {
          const kind = accPayType === 'Mobile money' ? 'mobile_money' : accPayType === 'Crypto wallet' ? 'btc' : 'bank';
          void http
            .post('/account/payout-methods', {
              kind,
              accountNumber: accForm.payAccount,
              accountName: accForm.name || 'Account holder',
              bankName: accForm.payBank || undefined,
              currency: 'USD',
              makeDefault: accForm.payDefault,
            })
            .then(() => {
              void client.invalidateQueries({ queryKey: ['account', 'payouts'] });
              finish('Payout method linked', 'It is saved on your account.');
            })
            .catch(fail);
          return;
        }
        if (api && k === 'password') {
          void http
            .post('/auth/password/change', { newPassword: accForm.pw })
            .then(() => {
              setState({ accForm: { ...accForm, pw: '' } });
              finish('Password updated', 'Use your new password the next time you sign in.');
            })
            .catch(fail);
          return;
        }
        if (k === 'profile') setState({ accSaved: { ...accForm } });
        if (k === 'doc') setState({ accDocSubmitted: true });
        if (k === 'payout')
          setState((x) => ({
            accPayouts: [
              ...x.accPayouts,
              { type: x.accPayType, ref: x.accForm.payAccount, def: x.accForm.payDefault },
            ],
          }));
        if (k === 'password') setState({ accForm: { ...accForm, pw: '' } });

        const msg: Record<string, [string, string]> = {
          profile: ['Profile updated', 'Your account details have been saved.'],
          doc: ['Document submitted', 'Our compliance desk will review it within 24 hours.'],
          payout: [
            'Payout method linked',
            'We will verify it with a small test deposit before first use.',
          ],
          password: ['Password updated', 'Use your new password the next time you sign in.'],
          sessions: [
            'Sessions updated',
            'Any devices you signed out will need to authenticate again.',
          ],
        };
        const m = msg[k] || ['Saved', 'Your changes have been saved.'];
        setState({
          modal: {
            title: m[0],
            body: m[1],
            confirmLabel: 'Done',
            confirm: () => {
              setState({ modal: null });
              go('account');
            },
          },
        });
      },
    };
  }, [
    accEditKind,
    accForm,
    accDocName,
    accDocUploaded,
    accPayType,
    accPayNetwork,
    accRevoked,
    setState,
    go,
    api,
    client,
    sessionsQuery.data,
  ]);
}

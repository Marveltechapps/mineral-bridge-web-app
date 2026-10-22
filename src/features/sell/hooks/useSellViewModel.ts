import { useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSellState, useSessionState } from '@/hooks/useAppState';
import { useActions } from '@/hooks/useActions';
import { isApiConfigured } from '@/lib/api/config';
import { http } from '@/lib/api/client';
import { CATS, PRODUCTS } from '@/constants/catalog';
import { getMinerals } from '@/features/catalog/services/catalogService';
import { countryName, resolveCountryCode } from '@/features/auth/phone';
import { uploadFile } from '@/lib/api/uploads';
import {
  asUploadableImage,
  holdSellPhotoFile,
  prepareSellPhotoUploads,
  releaseSellPhoto,
  sellPhotoFile,
  rememberedSellFileId,
  rememberSellFileId,
  sellPhotoProblemMessage,
} from '@/features/sell/sellPhotoFiles';
import { FIELD } from '@/constants/tokens';
import type { SellPhoto } from '@/types';
import { money } from '@/utils/format';

const MAX_SELL_PHOTOS = 4;
const MIN_SELL_PHOTOS = 3;
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const photoUploads = new Map<string, Promise<string>>();

function storeSellPhoto(photoId: string, file: File): Promise<string> {
  const known = rememberedSellFileId(photoId);
  if (known) return Promise.resolve(known);
  const existing = photoUploads.get(photoId);
  if (existing) return existing;
  const task = uploadFile(asUploadableImage(file), 'listing-photo')
    .then((fileId) => {
      rememberSellFileId(photoId, fileId);
      return fileId;
    })
    .catch((error: unknown) => {
      photoUploads.delete(photoId);
      throw error;
    });
  photoUploads.set(photoId, task);
  return task;
}

function isJpegOrPng(file: File): boolean {
  const type = file.type.toLowerCase();
  return type === 'image/jpeg' || type === 'image/png' || type === 'image/jpg' || /\.(jpe?g|png)$/i.test(file.name);
}

function previewFor(file: File): Promise<string> {
  if (typeof URL.createObjectURL === 'function') {
    try {
      const url = URL.createObjectURL(file);
      if (url) return Promise.resolve(url);
    } catch {
      // jsdom does not implement object URLs; fall through to a data URL.
    }
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error ?? new Error('Could not read the photo.'));
    reader.readAsDataURL(file);
  });
}

function releasePhoto(photo: SellPhoto | undefined) {
  if (!photo) return;
  photoUploads.delete(photo.id);
  releaseSellPhoto(photo);
}

/** Indicative gross rate the design applies to a seller's declared quantity. */
const INDICATIVE_RATE = 2410;
const SELLER_FEE = 0.02;

const pill = (on: boolean) =>
  'padding:12px 22px; border-radius:12px; border:1px solid ' +
  (on ? '#1e2a5a' : '#dde2f0') +
  '; background:' +
  (on ? '#1e2a5a' : '#fff') +
  '; color:' +
  (on ? '#fff' : '#4a5170') +
  '; font-size:14px; font-weight:700; cursor:pointer;';

const STEP_DEFS = [
  { n: 1, title: 'Mineral details', sub: 'What you have to sell' },
  { n: 2, title: 'Your location', sub: 'Where we visit you' },
  { n: 3, title: 'Review', sub: 'Check and submit' },
  { n: 4, title: 'Submitted', sub: 'What happens next' },
];

const SELL_TITLES: Record<number, [string, string]> = {
  1: ['Mineral details', 'Tell us what you have. Our team verifies it in person before anything moves.'],
  2: ['Your location', 'Where should our verification team visit you?'],
  3: ['Review your submission', 'Check the details before you submit.'],
  4: ['Submitted', 'What happens next.'],
};

/** View model for the four-step "Sell a mineral" wizard. */
export function useSellViewModel() {
  const { sellStep, sellForm, setState, go } = useSellState();
  const { authed } = useSessionState();
  const h = useActions();
  const api = isApiConfigured();
  const mineralsQuery = useQuery({
    queryKey: ['reference', 'minerals'],
    queryFn: ({ signal }) => getMinerals(signal),
    enabled: api,
  });
  const mineralOptions = api
    ? (mineralsQuery.data ?? []).map((m) => ({ v: m.id, label: m.name, category: m.categoryName }))
    : PRODUCTS.map((p) => ({ v: p.name, label: p.name, category: p.category }));
  const submitting = useRef(false);
  const photoSlots = useRef((sellForm.photos ?? []).length);
  photoSlots.current = (sellForm.photos ?? []).length;

  return useMemo(() => {
    const ss = sellStep;
    const sf = sellForm;
    const isOther = sf.mineral === '__other';
    const mineralLabel = mineralOptions.find((m) => m.v === sf.mineral)?.label;
    const resolvedMineral = isOther ? sf.customMineral || '' : mineralLabel || sf.mineral || '';

    const sellSteps = STEP_DEFS.map((s) => {
      const done = ss > s.n;
      const cur = ss === s.n;
      const locked = s.n > ss;
      return {
        n: s.n,
        title: s.title,
        sub: s.sub,
        titleColor: done || cur ? '#141a2e' : '#a3abc4',
        dotLabel: done ? '✓' : String(s.n),
        dot:
          'width:27px; height:27px; border-radius:14px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:12.5px; font-weight:800; background:' +
          (done ? '#16a34a' : cur ? '#1e2a5a' : '#eef1f8') +
          '; color:' +
          (done || cur ? '#fff' : '#8b95b4') +
          ';',
        rowStyle:
          'display:flex; align-items:flex-start; gap:13px; width:100%; background:none; border:none; padding:11px 0; text-align:left; cursor:' +
          (locked ? 'default' : 'pointer') +
          '; opacity:' +
          (locked ? '.55' : '1') +
          ';',
        locked,
        go: () => {
          if (s.n > sellStep) return;
          setState({ sellStep: s.n });
        },
      };
    });

    const sfQtyN = parseFloat(sf.qty) || 0;
    const sGross = api ? 0 : sfQtyN * INDICATIVE_RATE;
    const sFeeV = api ? 0 : sGross * SELLER_FEE;

    const sellNext = () => {
      const cur = sellStep;
      if (cur === 4) {
        setState({ sellStep: 1 });
        go('home');
        return;
      }
      if (cur === 1) {
        const missing: string[] = [];
        const chosen = sf.mineral === '__other' ? sf.customMineral || '' : sf.mineral || '';
        if (!chosen.trim()) missing.push('mineral name');
        if (!(parseFloat(sf.qty) > 0)) missing.push('a quantity greater than zero');
        if (!sf.form.trim()) missing.push('a form');
        if ((sf.photos?.length ?? 0) < MIN_SELL_PHOTOS) missing.push('at least 3 photos');
        if (missing.length) {
          setState({
            modal: {
              title: 'A few details missing',
              body: `Please enter ${missing.join(' and ')} so we can price your lot accurately.`,
              confirmLabel: 'Got it',
              confirm: () => setState({ modal: null }),
            },
          });
          return;
        }
      }
      if (cur === 2) {
        if (!sf.city.trim()) {
          setState({
            modal: {
              title: 'Location needed',
              body: 'Enter the city or site where the verification team should visit you.',
              confirmLabel: 'Got it',
              confirm: () => setState({ modal: null }),
            },
          });
          return;
        }
        if (!resolveCountryCode(sf.country)) {
          setState({
            modal: {
              title: 'Country needed',
              body: sf.country.trim()
                ? `“${sf.country.trim()}” is not a country we can use for the verification visit. Enter the country name or its 2-letter code, such as India or IN.`
                : 'Enter the country for the verification visit, such as India or IN.',
              confirmLabel: 'Got it',
              confirm: () => setState({ modal: null }),
            },
          });
          return;
        }
      }
      if (cur === 3) {
        if (!authed) {
          setState({
            authOpen: true,
            authMode: 'signup',
            authStage: 'form',
            pendingResume: 'sell',
          });
          return;
        }
        if (submitting.current) return;
        h.requireKyc(
          'submit a listing',
          () => {
            if (!api) {
              setState({ sellStep: 4 });
              return;
            }
            const chosen = mineralOptions.find((m) => m.v === sf.mineral);
            const form = sf.form === 'Semi-finished' ? 'semi_finished' : sf.form === 'Finished' ? 'finished' : 'raw';
            const slot = sf.slot.toLowerCase();
            const country = resolveCountryCode(sf.country);
            if (!country) {
              setState({
                modal: {
                  title: 'Country needed',
                  body: sf.country.trim()
                    ? `“${sf.country.trim()}” is not a country we can use for the verification visit. Enter the country name or its 2-letter code, such as India or IN.`
                    : 'Enter the country for the verification visit, such as India or IN.',
                  confirmLabel: 'Got it',
                  confirm: () => setState({ modal: null, sellStep: 2 }),
                },
              });
              return;
            }
            submitting.current = true;
            const photos = sf.photos ?? [];
            void (async () => {
              const prepared = await prepareSellPhotoUploads(photos, storeSellPhoto);
              const savedIds = new Map(prepared.saved.map((item) => [item.id, item.fileId]));
              const missingIds = new Set(prepared.missing.map((item) => item.id));
              const problem = sellPhotoProblemMessage(prepared.missing, prepared.failed);
              setState((s) => ({
                sellForm: {
                  ...s.sellForm,
                  photos: (s.sellForm.photos ?? []).map((item) => ({
                    ...item,
                    fileId: savedIds.get(item.id) ?? item.fileId,
                    unavailable: missingIds.has(item.id),
                  })),
                },
                ...(problem
                  ? {
                      modal: {
                        title: missingIds.size ? 'Choose a photo again' : 'Listing was not submitted',
                        body: problem,
                        confirmLabel: missingIds.size ? 'Choose photo' : 'Close',
                        confirm: () => setState(missingIds.size ? { modal: null, sellStep: 1 } : { modal: null }),
                      },
                    }
                  : {}),
              }));
              if (problem) return false;
              await http.post('/listings', {
                mineralId: sf.mineral === '__other' ? null : sf.mineral,
                customMineralName: sf.mineral === '__other' ? sf.customMineral : chosen?.label,
                quantity: { value: parseFloat(sf.qty) || 0, unit: sf.unit },
                form,
                verificationAddress: {
                  city: sf.city || 'Unspecified',
                  country,
                  countryName: countryName(country),
                },
                preferredSlot: slot === 'morning' || slot === 'afternoon' ? slot : 'flexible',
                payoutPreference: sf.payout || 'Bank transfer',
                photoFileIds: prepared.fileIds,
                submit: true,
              }, { headers: { 'Idempotency-Key': crypto.randomUUID() } });
              return true;
            })()
              .then((submitted) => {
                if (submitted) setState({ sellStep: 4 });
              })
              .catch((error: unknown) => {
                setState({
                  modal: {
                    title: 'Listing was not submitted',
                    body: error instanceof Error ? error.message : 'The sell request could not be saved.',
                    confirmLabel: 'Close',
                    confirm: () => setState({ modal: null }),
                  },
                });
              })
              .finally(() => {
                submitting.current = false;
              });
          },
          'sell',
        );
        return;
      }
      setState({ sellStep: cur + 1 });
      requestAnimationFrame(() => window.scrollTo({ top: 0 }));
    };

    return {
      lbl: FIELD.lbl,
      inp: FIELD.inp,
      ta: FIELD.ta,
      sel: FIELD.sel,
      sellSteps,
      sellProgress: (ss / 4) * 100 + '%',
      sellProgressLabel: 'Step ' + ss + ' of 4',
      sellTitle: SELL_TITLES[ss][0],
      sellSubtitle: SELL_TITLES[ss][1],
      sellStep1: ss === 1,
      sellStep2: ss === 2,
      sellStep3: ss === 3,
      sellStep4: ss === 4,
      sellCanBack: ss > 1 && ss < 4,
      sellNextLabel:
        ss === 3 ? 'Submit' : ss === 4 ? 'Back to home' : 'Continue',
      sellSummary: [
        { k: 'Mineral', v: resolvedMineral || '—' },
        { k: 'Category', v: sf.category },
        { k: 'Quantity', v: (sf.qty || '—') + ' ' + sf.unit },
        { k: 'Form', v: sf.form },
        { k: 'Photos', v: String((sf.photos ?? []).length) },
        {
          k: 'Verification location',
          v: (() => {
            const code = resolveCountryCode(sf.country);
            const label = code ? countryName(code) : sf.country.trim();
            return (sf.city || 'Not set') + (label ? ', ' + label : '');
          })(),
        },
      ],
      sellNextSteps: [
        {
          n: '1',
          title: 'We contact you to arrange a visit',
          sub: 'Our verification team agrees a date and travels to your location.',
        },
        {
          n: '2',
          title: 'Verification on site',
          sub: 'The mineral is checked and confirmed in person, at your location.',
        },
        {
          n: '3',
          title: 'Packed and shipped to us',
          sub: 'Once verified, it is packed, sealed and sent to Mineral Bridge.',
        },
        {
          n: '4',
          title: 'Support arranges your payment',
          sub: 'Our support team contacts you directly to confirm and release payment.',
        },
      ],
      sellForm: sf,
      sellCatOpts: (api
        ? Array.from(new Set(mineralOptions.map((m) => m.category).filter(Boolean)))
        : CATS.map((c) => c.name)
      ).map((name) => ({ v: name, sel: sf.category === name })),
      sellUnitOpts: ['g', 'kg', 'oz', 'ct', 'MT'].map((u) => ({ v: u, sel: sf.unit === u })),
      sellMineralOpts: [{ v: '', label: 'Select a mineral…' }]
        .concat(mineralOptions.map((p) => ({ v: p.v, label: p.label })))
        .concat([{ v: '__other', label: 'Other — not listed' }])
        .map((o) => ({ v: o.v, label: o.label, sel: sf.mineral === o.v })),
      sellIsOther: isOther,
      sellMineralLabel: resolvedMineral || 'your mineral',
      sellFormOpts: ['Raw', 'Semi-finished', 'Finished'].map((o) => ({
        label: o,
        style: pill(sf.form === o),
        select: () => setState((s) => ({ sellForm: { ...s.sellForm, form: o } })),
      })),
      sellSlotOpts: ['Morning', 'Afternoon', 'Flexible'].map((o) => ({
        label: o,
        style: pill(sf.slot === o),
        select: () => setState((s) => ({ sellForm: { ...s.sellForm, slot: o } })),
      })),
      sellPhotos: [0, 1, 2, 3].map((i) => {
        const photo = (sf.photos ?? [])[i];
        return {
          i,
          name: photo?.name ?? '',
          previewUrl: photo?.previewUrl ?? '',
          saved: Boolean(photo?.fileId),
          unavailable: Boolean(photo?.unavailable),
          removeLabel: photo ? `Remove ${photo.name}` : '',
          chooseAgainLabel: photo ? `Choose ${photo.name} again` : '',
          replace: (file: File) => {
            if (!photo) return;
            if (!isJpegOrPng(file) || file.size <= 0 || file.size > MAX_PHOTO_BYTES) {
              setState({
                modal: {
                  title: 'Photo was not added',
                  body: 'Use a JPG or PNG file, up to 10 MB. Your other listing details are unchanged.',
                  confirmLabel: 'Got it',
                  confirm: () => setState({ modal: null }),
                },
              });
              return;
            }
            const replacedId = photo.id;
            releasePhoto(photo);
            const id = crypto.randomUUID();
            holdSellPhotoFile(id, file);
            void previewFor(file).then((previewUrl) => {
              const next: SellPhoto = { id, name: file.name || 'photo', previewUrl };
              setState((s) => ({
                sellForm: {
                  ...s.sellForm,
                  photos: (s.sellForm.photos ?? []).map((item) => (item.id === replacedId ? next : item)),
                },
              }));
              if (api && authed) {
                void storeSellPhoto(id, file)
                  .then((fileId) => {
                    setState((s) => ({
                      sellForm: {
                        ...s.sellForm,
                        photos: (s.sellForm.photos ?? []).map((item) => (item.id === id ? { ...item, fileId } : item)),
                      },
                    }));
                  })
                  .catch((error: unknown) => {
                    setState({
                      modal: {
                        title: 'Photo was not uploaded',
                        body: error instanceof Error
                          ? `${next.name} could not be uploaded (${error.message}). It is still shown, and the rest of this listing is unchanged. Submit again to retry it.`
                          : `${next.name} could not be uploaded. It is still shown, and the rest of this listing is unchanged. Submit again to retry it.`,
                        confirmLabel: 'Close',
                        confirm: () => setState({ modal: null }),
                      },
                    });
                  });
              }
            });
          },
          box:
            'position:relative; aspect-ratio:1; border-radius:12px; overflow:hidden; background:' +
            (photo?.previewUrl ? '#111' : '#eef1f8') +
            '; border:1px solid #eef1f8;',
          remove: () => {
            if (!photo) return;
            releasePhoto(photo);
            photoSlots.current = Math.max(0, photoSlots.current - 1);
            setState((s) => ({
              sellForm: { ...s.sellForm, photos: (s.sellForm.photos ?? []).filter((item) => item.id !== photo.id) },
            }));
          },
        };
      }),
      addSellPhotos: (list: FileList | File[] | null) => {
        const incoming = Array.from(list ?? []);
        if (incoming.length === 0) return;
        const rejected = incoming.filter((file) => !isJpegOrPng(file) || file.size <= 0 || file.size > MAX_PHOTO_BYTES);
        const accepted = incoming.filter((file) => isJpegOrPng(file) && file.size > 0 && file.size <= MAX_PHOTO_BYTES);
        const room = MAX_SELL_PHOTOS - photoSlots.current;
        const next = accepted.slice(0, Math.max(0, room));
        photoSlots.current += next.length;
        void Promise.all(next.map(async (file) => {
          const id = crypto.randomUUID();
          holdSellPhotoFile(id, file);
          const photo: SellPhoto = { id, name: file.name || 'photo', previewUrl: await previewFor(file) };
          return photo;
        })).then((photos) => {
          if (!photos.length) return;
          setState((s) => {
            const existing = s.sellForm.photos ?? [];
            const take = photos.slice(0, Math.max(0, MAX_SELL_PHOTOS - existing.length));
            photos.slice(take.length).forEach(releasePhoto);
            photoSlots.current = existing.length + take.length;
            return { sellForm: { ...s.sellForm, photos: [...existing, ...take] } };
          });
          if (api && authed) {
            for (const photo of photos) {
              void sellPhotoFile(photo)
                .then((file) => {
                  if (!file) return;
                  return storeSellPhoto(photo.id, file).then((fileId) => {
                    setState((s) => ({
                      sellForm: {
                        ...s.sellForm,
                        photos: (s.sellForm.photos ?? []).map((item) => (item.id === photo.id ? { ...item, fileId, unavailable: false } : item)),
                      },
                    }));
                  });
                })
                .catch((error: unknown) => {
                  setState({
                    modal: {
                      title: 'Photo was not uploaded',
                      body: error instanceof Error
                        ? `${photo.name} could not be uploaded (${error.message}). It is still shown, and the rest of this listing is unchanged. Submit again to retry it.`
                        : `${photo.name} could not be uploaded. It is still shown, and the rest of this listing is unchanged. Submit again to retry it.`,
                      confirmLabel: 'Close',
                      confirm: () => setState({ modal: null }),
                    },
                  });
                });
            }
          }
        });
        if (rejected.length || accepted.length > next.length) {
          setState({
            modal: {
              title: 'Some photos were skipped',
              body: room <= 0
                ? 'You can add up to 4 photos. Remove one to add another.'
                : 'Use JPG or PNG files, up to 10 MB each, and no more than 4 photos.',
              confirmLabel: 'Got it',
              confirm: () => setState({ modal: null }),
            },
          });
        }
      },
      sellGross: api ? '—' : money(sGross),
      sellFee: api ? '—' : money(sFeeV),
      sellNet: api ? '—' : money(sGross - sFeeV),
      sellBack: () => setState((s) => ({ sellStep: Math.max(1, s.sellStep - 1) })),
      sellNext,
      sfMineralPick: (e: React.ChangeEvent<HTMLSelectElement>) => {
        const v = e.target.value;
        const p = mineralOptions.find((x) => x.v === v);
        setState((s) => ({
          sellForm: {
            ...s.sellForm,
            mineral: v,
            category: p ? p.category : s.sellForm.category,
            customMineral: v === '__other' ? s.sellForm.customMineral : '',
          },
        }));
      },
      sfCustomMineral: (e: React.ChangeEvent<HTMLInputElement>) =>
        setState((s) => ({ sellForm: { ...s.sellForm, customMineral: e.target.value } })),
      sfCategory: (e: React.ChangeEvent<HTMLSelectElement>) =>
        setState((s) => ({ sellForm: { ...s.sellForm, category: e.target.value } })),
      sfQty: (e: React.ChangeEvent<HTMLInputElement>) =>
        setState((s) => ({
          sellForm: { ...s.sellForm, qty: e.target.value.replace(/[^0-9.-]/g, '') },
        })),
      sfUnit: (e: React.ChangeEvent<HTMLSelectElement>) =>
        setState((s) => ({ sellForm: { ...s.sellForm, unit: e.target.value } })),
      sfCity: (e: React.ChangeEvent<HTMLInputElement>) =>
        setState((s) => ({ sellForm: { ...s.sellForm, city: e.target.value } })),
      sfCountry: (e: React.ChangeEvent<HTMLInputElement>) =>
        setState((s) => ({ sellForm: { ...s.sellForm, country: e.target.value } })),
    };
  }, [sellStep, sellForm, authed, setState, go, h, api, mineralOptions]);
}

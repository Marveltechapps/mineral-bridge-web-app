/** The "How it works" walkthrough, shown as an overlay and as a full page. */
export interface HowItWorksSlice {
  hiwChapter: number;
  hiwPlaying: boolean;
  hiwTopic: string | null;
  hiwOverlay: boolean;
}

/** Session-storage key recording that the "How it works" intro has been seen. */
export const HIW_SEEN_KEY = 'mb_hiw_seen';

/** The overlay shows once per session; storage being unavailable must not break it. */
const hiwUnseen = (): boolean => {
  try {
    return sessionStorage.getItem(HIW_SEEN_KEY) !== '1';
  } catch {
    return true;
  }
};

export const markHiwSeen = (): void => {
  try {
    sessionStorage.setItem(HIW_SEEN_KEY, '1');
  } catch {
    /* storage unavailable — the overlay simply reappears next session */
  }
};

export const howItWorksInitial: HowItWorksSlice = {
  hiwChapter: 0,
  hiwPlaying: false,
  hiwTopic: 'sell',
  hiwOverlay: hiwUnseen(),
};

export const HOW_IT_WORKS_KEYS = [
  'hiwChapter',
  'hiwPlaying',
  'hiwTopic',
  'hiwOverlay',
] as const satisfies readonly (keyof HowItWorksSlice)[];

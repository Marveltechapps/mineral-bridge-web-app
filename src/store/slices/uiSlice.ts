import type { ModalSpec } from '@/types';

/** Transient chrome that is not owned by any one feature. */
export interface UiSlice {
  /** The confirmation sheet, or `null` when nothing is open. */
  modal: ModalSpec | null;
}

export const uiInitial: UiSlice = {
  modal: null,
};

export const UI_KEYS = ['modal'] as const satisfies readonly (keyof UiSlice)[];

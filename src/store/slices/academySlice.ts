/** Course selection and lesson progress in the academy. */
export interface AcademySlice {
  acTrack: 'asm' | 'platform';
  courseId: string;
  lessonIdx: number;
  /** Lessons completed per course id. */
  lessonDone: Record<string, number>;
  playing: boolean;
}

export const academyInitial: AcademySlice = {
  acTrack: 'asm',
  courseId: 'c1',
  lessonIdx: 0,
  lessonDone: {},
  playing: false,
};

export const ACADEMY_KEYS = [
  'acTrack',
  'courseId',
  'lessonIdx',
  'lessonDone',
  'playing',
] as const satisfies readonly (keyof AcademySlice)[];

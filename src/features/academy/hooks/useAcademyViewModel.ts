import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAcademyState } from '@/hooks/useAppState';
import { isApiConfigured } from '@/lib/api/config';
import { http } from '@/lib/api/client';
import { COURSES, LESSON_TITLES } from '@/constants/courses';
import type { Course } from '@/types';

const EMPTY_COURSES: Course[] = [];

const acChip = (on: boolean) =>
  'padding:9px 20px; border-radius:10px; border:1px solid ' +
  (on ? '#1e2a5a' : '#dde2f0') +
  '; background:' +
  (on ? '#1e2a5a' : '#fff') +
  '; color:' +
  (on ? '#fff' : '#4a5170') +
  '; font-size:13px; font-weight:700; cursor:pointer;';

/** View model for the ASM Academy listing and a single course. */
const BLANK_COURSE: Course = {
  id: '',
  track: 'asm',
  title: '',
  sub: '',
  level: '',
  lessons: 1,
  duration: '',
  done: 0,
  certified: false,
  ic: 'shield',
  grad: 'linear-gradient(140deg,#1e2a5a,#141a2e)',
};

export function useAcademyViewModel() {
  const { acTrack, courseId, lessonIdx, lessonDone, playing, setState, go } = useAcademyState();
  const api = isApiConfigured();
  const coursesQuery = useQuery({
    queryKey: ['academy', 'courses'],
    queryFn: async ({ signal }) => {
      const page = await http.get<{
        items: Array<{ id: string; title: string; summary?: string | null; level?: string; lessons?: number; durationSec?: number; progress?: { completedLessons?: number; percent?: number }; imageUrl?: string | null }>;
      }>('/academy/courses', { signal });
      return page.items.map((course): Course => ({
        id: course.id,
        track: acTrack,
        title: course.title,
        sub: course.summary || '',
        level: course.level || '',
        lessons: course.lessons || course.progress?.completedLessons || 0,
        duration: course.durationSec ? `${Math.round(course.durationSec / 60)} min` : '',
        done: course.progress?.completedLessons || 0,
        certified: false,
        ic: 'shield',
        grad: course.imageUrl
          ? `url("${course.imageUrl}") center/cover, linear-gradient(140deg,#1e2a5a,#141a2e)`
          : 'linear-gradient(140deg,#1e2a5a,#141a2e)',
      }));
    },
    enabled: api,
  });
  const source = api ? (coursesQuery.data ?? EMPTY_COURSES) : COURSES;

  return useMemo(() => {
    const courses = source.filter((c) => api || c.track === acTrack).map((c) => {
      const pct = c.lessons ? Math.round((c.done / c.lessons) * 100) : 0;
      return {
        ...c,
        progress: pct + '%',
        progressLabel:
          c.done === 0
            ? 'Not started'
            : c.done >= c.lessons
              ? 'Completed'
              : c.done + ' of ' + c.lessons + ' lessons',
        cta: c.done === 0 ? 'Start course' : c.done >= c.lessons ? 'Review course' : 'Continue',
        open: () => {
          setState({ courseId: c.id, lessonIdx: Math.min(c.done, c.lessons - 1) });
          go('course');
        },
      };
    });

    const cc = source.find((c) => c.id === courseId) || (api ? BLANK_COURSE : COURSES[0]);
    const ccDone = lessonDone[cc.id] != null ? lessonDone[cc.id] : cc.done;
    const ccPct = cc.lessons ? Math.round((ccDone / cc.lessons) * 100) : 0;

    const course = {
      ...cc,
      progress: ccPct + '%',
      progressLabel: ccPct + '%',
      currentLesson:
        'Lesson ' + (lessonIdx + 1) + ' · ' + (LESSON_TITLES[lessonIdx] || 'Overview'),
      lessonLength: '07:20',
      canCertify: ccDone >= cc.lessons,
      desc:
        cc.sub +
        ' This module is delivered in short video lessons with a short assessment at the end. Completing it adds a verified badge to your seller profile, which buyers can see.',
      outcomes: [
        { v: 'Identify and map the main hazards on your site' },
        { v: 'Apply correct shoring and ground-support methods' },
        { v: 'Test for gas and maintain airflow underground' },
        { v: 'Run an emergency drill with your crew' },
      ],
      lessons: Array.from({ length: cc.lessons }).map((_, i) => {
        const done = i < ccDone;
        const cur = i === lessonIdx;
        return {
          i,
          title: 'Lesson ' + (i + 1) + ' · ' + (LESSON_TITLES[i] || 'Module ' + (i + 1)),
          length: '07:20',
          done,
          color: done || cur ? '#141a2e' : '#a3abc4',
          dot:
            'width:22px; height:22px; border-radius:11px; flex-shrink:0; display:flex; align-items:center; justify-content:center; background:' +
            (done ? '#16a34a' : cur ? '#2563eb' : '#eef1f8') +
            ';',
          rowStyle:
            'display:flex; align-items:flex-start; gap:12px; width:100%; padding:11px 0; border:none; background:' +
            (cur ? '#f7f8fc' : 'none') +
            '; border-radius:10px; cursor:pointer; text-align:left;',
          select: () => setState({ lessonIdx: i }),
        };
      }),
    };

    return {
      academyTracks: (
        [
          { k: 'asm', label: 'Safe mining (ASM)' },
          { k: 'platform', label: 'Trading on Mineral Bridge' },
        ] as const
      ).map((t) => ({
        k: t.k,
        label: t.label,
        style: acChip(acTrack === t.k),
        select: () => setState({ acTrack: t.k }),
      })),
      academyStats: api
        ? [
            { value: String(source.length), label: 'Published courses' },
            { value: '0', label: 'Miners certified' },
            { value: '—', label: 'Languages' },
          ]
        : [
            { value: '12', label: 'Free courses' },
            { value: '4,800+', label: 'Miners certified' },
            { value: '6', label: 'Languages' },
          ],
      courses,
      course,
      playing: playing,
      playPos: playing ? '42%' : '0%',
      playTime: playing ? '03:04' : '00:00',
      togglePlay: () => setState((s) => ({ playing: !s.playing })),
      completeLesson: () =>
        setState((s) => {
          const c = source.find((x) => x.id === s.courseId) || (api ? BLANK_COURSE : COURSES[0]);
          const cur = s.lessonDone[c.id] != null ? s.lessonDone[c.id] : c.done;
          const next = Math.min(c.lessons, Math.max(cur, s.lessonIdx + 1));
          return {
            lessonDone: { ...s.lessonDone, [c.id]: next },
            lessonIdx: Math.min(c.lessons - 1, s.lessonIdx + 1),
            playing: false,
          };
        }),
      claimCert: () =>
        setState({
          modal: {
            title: 'Certificate issued',
            body: 'Your verified training badge is now visible on your seller profile. Buyers can see it on every lot you list.',
            confirmLabel: 'Done',
            confirm: () => setState({ modal: null }),
          },
        }),
    };
  }, [
    acTrack,
    courseId,
    lessonIdx,
    lessonDone,
    playing,
    setState,
    go,
    source,
    api,
  ]);
}

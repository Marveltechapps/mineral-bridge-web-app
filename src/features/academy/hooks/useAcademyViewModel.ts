import { useMemo } from 'react';
import { useAcademyState } from '@/hooks/useAppState';
import { COURSES, LESSON_TITLES } from '@/constants/courses';

const acChip = (on: boolean) =>
  'padding:9px 20px; border-radius:10px; border:1px solid ' +
  (on ? '#1e2a5a' : '#dde2f0') +
  '; background:' +
  (on ? '#1e2a5a' : '#fff') +
  '; color:' +
  (on ? '#fff' : '#4a5170') +
  '; font-size:13px; font-weight:700; cursor:pointer;';

/** View model for the ASM Academy listing and a single course. */
export function useAcademyViewModel() {
  const { acTrack, courseId, lessonIdx, lessonDone, playing, setState, go } = useAcademyState();

  return useMemo(() => {
    const courses = COURSES.filter((c) => c.track === acTrack).map((c) => {
      const pct = Math.round((c.done / c.lessons) * 100);
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

    const cc = COURSES.find((c) => c.id === courseId) || COURSES[0];
    const ccDone = lessonDone[cc.id] != null ? lessonDone[cc.id] : cc.done;
    const ccPct = Math.round((ccDone / cc.lessons) * 100);

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
      academyStats: [
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
          const c = COURSES.find((x) => x.id === s.courseId) || COURSES[0];
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
  ]);
}

import { redirect } from 'next/navigation';

/** BUG-007: `/` must open the real Mineral Bridge app, not the starter scaffold. */
export default function HomePage() {
  redirect('/app');
}

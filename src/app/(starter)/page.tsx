import { redirect } from 'next/navigation';

/** The trading app is the product. The starter page used to sit on `/`. */
export default function HomePage() {
  redirect('/app');
}

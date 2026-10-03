import { redirect } from 'next/navigation';

// RIWĀ showcase entry point. Kept isolated on the real-estate branch.
export default function HomePage() {
  redirect('/riwa/index.html');
}

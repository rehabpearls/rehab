import { redirect } from 'next/navigation';

// /performance redirects to the main dashboard where performance data lives
export default function PerformancePage() {
  redirect('/dashboard');
}
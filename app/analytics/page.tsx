import { redirect } from 'next/navigation';

// /analytics redirects to the main dashboard where analytics live
export default function AnalyticsPage() {
  redirect('/dashboard');
}
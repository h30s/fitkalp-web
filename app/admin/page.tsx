import { Metadata } from 'next';
import LeadsDashboard from '@/components/admin/LeadsDashboard';

export const metadata: Metadata = {
  title: 'Founder Lead Control - Himanshu Soni | FitKalp',
  description: 'Private lead dashboard for FitKalp inbound inquiries.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <LeadsDashboard />;
}

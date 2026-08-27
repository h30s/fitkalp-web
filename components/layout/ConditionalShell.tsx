'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';

export default function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isExcluded =
    pathname.startsWith('/ops') ||
    pathname.startsWith('/portal') ||
    pathname.startsWith('/himanshu-soni') ||
    pathname.startsWith('/himanshu') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/agreements/sign');

  if (isExcluded) return <>{children}</>;

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

import type { Metadata } from 'next';
import CaseStudiesClient from './CaseStudiesClient';

export const metadata: Metadata = {
  title: 'Case Studies & Operational Benchmarks - FitKalp',
  description:
    'Discover how FitKalp transforms Indian gym operations. Learn about our 2026 Founding Partner Cohort, measured operational vitals, and before-and-after blueprints.',
};

export default function CaseStudiesPage() {
  return <CaseStudiesClient />;
}


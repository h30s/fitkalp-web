import { Metadata } from 'next';
import PricingClient from './PricingClient';

export const metadata: Metadata = {
  title: 'Pricing - Transparent gym CRM plans',
  description: 'FitKalp pricing is published, transparent, and in rupees. No hidden fees. Start at ₹599/month. Cancel any time.'
};

export default function PricingPage() {
  return <PricingClient />;
}

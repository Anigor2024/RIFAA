import { GiftAtelierClient } from './GiftAtelierClient';
import { giftPreferencesFromParams } from '@/lib/gifts';

type GiftQuery = {
  recipient?: string | string[];
  occasion?: string | string[];
  mood?: string | string[];
  budget?: string | string[];
};

export default async function GiftsPage({
  searchParams,
}: {
  searchParams: Promise<GiftQuery>;
}) {
  const query = await searchParams;
  const parsed = new URLSearchParams();

  for (const key of ['recipient', 'occasion', 'mood', 'budget'] as const) {
    const value = query[key];
    if (typeof value === 'string') parsed.set(key, value);
  }

  return <GiftAtelierClient initialPreferences={giftPreferencesFromParams(parsed)} />;
}

import { NextResponse } from 'next/server';
import { DEMO_PRODUCTS } from '@/data/products';
import { JOURNAL_STORIES } from '@/data/stories';

export const dynamic = 'force-dynamic';

export async function GET() {
  const commerceMode = process.env.NEXT_PUBLIC_COMMERCE_MODE === 'live' ? 'live' : 'demo';

  return NextResponse.json(
    {
      status: 'ok',
      service: 'rifaa-storefront',
      commerceMode,
      catalog: {
        products: DEMO_PRODUCTS.length,
        editorialStories: JOURNAL_STORIES.length,
      },
      deployment: {
        commit: process.env.VERCEL_GIT_COMMIT_SHA || null,
        environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown',
      },
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}

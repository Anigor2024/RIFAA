import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { JOURNAL_STORIES } from '@/data/stories';
import { EditorialDetailClient } from './EditorialDetailClient';

interface EditorialPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return JOURNAL_STORIES.map((story) => ({
    slug: story.slug,
  }));
}

export async function generateMetadata({ params }: EditorialPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = JOURNAL_STORIES.find((s) => s.slug === slug);

  if (!story) {
    return {
      title: 'المقال غير متوفر | رِفْعة RIFAA',
    };
  }

  return {
    title: `${story.titleAr} | ${story.titleEn} — رِفْعة RIFAA`,
    description: `${story.excerptAr} ${story.excerptEn}`,
    openGraph: {
      title: `${story.titleAr} | رِفْعة`,
      description: story.excerptAr,
      images: [
        {
          url: story.image,
          alt: story.titleAr,
        },
      ],
    },
  };
}

export default async function EditorialDetailPage({ params }: EditorialPageProps) {
  const { slug } = await params;
  const story = JOURNAL_STORIES.find((s) => s.slug === slug);

  if (!story) {
    notFound();
  }

  const otherStories = JOURNAL_STORIES.filter((s) => s.id !== story.id);

  return <EditorialDetailClient story={story} otherStories={otherStories} />;
}

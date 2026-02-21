import { TrackView } from '@/src/presentation/components/track/TrackView';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'ขอบัตรคิว | Quick Queue',
    description: 'เช็คสถานะการขอบัตรคิวของคุณ',
  };
}

export default function TrackPage() {
  return <TrackView />;
}

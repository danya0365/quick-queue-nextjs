import { DisplayRequestView } from '@/src/presentation/components/display/request/DisplayRequestView';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'ขอบัตรคิว | Quick Queue',
    description: 'ขอบัตรคิวออนไลน์ สะดวก รวดเร็ว',
  };
}

export default function DisplayRequestPage() {
  return <DisplayRequestView />;
}

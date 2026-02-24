import { DEFAULT_SHOP_CONFIG } from '@/src/config/shop.config';
import { getQueueRequestRepository } from '@/src/infrastructure/repositories/RepositoryFactory';
import { DisplayTicketView } from '@/src/presentation/components/display/ticket/DisplayTicketView';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `รับบัตรคิว | ${DEFAULT_SHOP_CONFIG.shopName}`,
    description: 'รายละเอียดบัตรคิวและ QR Code สำหรับติดตามสถานะคิว',
  };
}

export default async function DisplayTicketPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  
  if (!code || code.length !== 6) {
    notFound();
  }

  const repository = getQueueRequestRepository();
  const queueRequest = await repository.getByTrackingCode(code.toUpperCase());

  if (!queueRequest) {
    notFound();
  }
  
  // Optionally, get queue length
  let waitCount = 0;
  try {
    const [pendingCount] = await Promise.all([
      repository.getPendingCount(undefined, queueRequest.serviceType)
    ]);
    waitCount = pendingCount;
  } catch (e) {
    console.error('Failed to fetch wait count', e);
  }

  return (
    <DisplayTicketView 
      trackingCode={queueRequest.trackingCode} 
      customerName={queueRequest.customerName} 
      serviceType={queueRequest.serviceType} 
      waitCount={waitCount}
    />
  );
}

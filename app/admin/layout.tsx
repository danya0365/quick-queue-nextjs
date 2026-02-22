import { AdminLayoutView } from '@/src/presentation/components/admin/AdminLayoutView';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutView>{children}</AdminLayoutView>;
}

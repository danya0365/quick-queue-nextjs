import { Footer } from '@/src/presentation/components/layout/Footer';
import { Header } from '@/src/presentation/components/layout/Header';
import { MobileBottomNav } from '@/src/presentation/components/layout/MobileBottomNav';

export interface MainClassicLayoutProps {
  children: React.ReactNode;
}

export function MainClassicLayout({ children }: MainClassicLayoutProps) {
  return (
    <div
      className="
        flex flex-col
        h-[100dvh] w-screen
        overflow-hidden
        bg-background text-foreground
      "
      id="main-classic-layout"
    >
      <Header />

      {/* Content Area - scrolls internally */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative" id="main-content">
        {children}
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}

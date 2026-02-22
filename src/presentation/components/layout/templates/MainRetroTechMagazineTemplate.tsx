import { DEFAULT_SHOP_CONFIG } from '@/src/domain/types/queue';
import { useAppVersion } from '@/src/presentation/hooks/useAppVersion';
import Link from 'next/link';

export interface MainRetroTechMagazineTemplateProps {
  children: React.ReactNode;
}

export function MainRetroTechMagazineTemplate({ children }: MainRetroTechMagazineTemplateProps) {
  const currentYear = new Date().getFullYear();
  const { displayVersion } = useAppVersion();

  return (
    <div
      className="
        flex flex-col
        h-[100dvh] w-screen
        overflow-hidden
        font-sans selection:bg-[#FF00FF] selection:text-white
      "
      style={{
        backgroundColor: '#f4f4f0',
        backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        color: '#111',
      }}
      id="main-retro-layout"
    >
      {/* ─── Retro Navbar ─── */}
      <nav className="border-b-8 border-black bg-white flex flex-row justify-between items-center px-4 sm:px-8 py-3 shrink-0 z-50">
        <Link href="/" className="text-2xl sm:text-3xl font-black uppercase tracking-tighter hover:text-[#FF00FF] transition-colors">
          {DEFAULT_SHOP_CONFIG.shopName}
        </Link>
        
        <div className="flex font-bold uppercase text-xs sm:text-sm border-4 border-black bg-[#00FFFF] shadow-[4px_4px_0_0_rgba(0,0,0,1)] transform -skew-x-6 z-10">
          <Link href="/queue" className="px-3 sm:px-6 py-2 border-r-4 border-black hover:bg-[#FF00FF] hover:text-white transition-colors flex items-center justify-center">
            <span className="transform skew-x-6 block">QUEUE</span>
          </Link>
          <Link href="/track" className="px-3 sm:px-6 py-2 border-r-4 border-black hover:bg-[#FF00FF] hover:text-white transition-colors flex items-center justify-center">
            <span className="transform skew-x-6 block">TRACK</span>
          </Link>
          <Link href="/admin" className="px-3 sm:px-6 py-2 hover:bg-[#39FF14] transition-colors flex items-center justify-center">
            <span className="transform skew-x-6 block">ADMIN</span>
          </Link>
        </div>
      </nav>

      {/* ─── Content Area ─── */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative" id="main-content">
        {children}
      </main>

      {/* ─── Retro Footer ─── */}
      <footer className="border-t-8 border-black bg-black text-white px-6 py-4 font-bold uppercase text-xs sm:text-sm text-center shrink-0 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="tracking-widest opacity-80">© {currentYear} QUICK QUEUE // {displayVersion}</p>
        <div className="flex items-center gap-2">
          <span>//</span>
          <a 
            href="https://cleancode1986-portfolio.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#39FF14] hover:text-[#FF00FF] hover:-translate-y-0.5 transition-all inline-block underline decoration-2 underline-offset-4"
          >
            CRAFTED BY CLEANCODE
          </a>
        </div>
      </footer>
    </div>
  );
}

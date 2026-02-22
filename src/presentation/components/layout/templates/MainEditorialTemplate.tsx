import { DEFAULT_SHOP_CONFIG } from '@/src/domain/types/queue';
import { useAppVersion } from '@/src/presentation/hooks/useAppVersion';
import Link from 'next/link';

export interface MainEditorialTemplateProps {
  children: React.ReactNode;
}

export function MainEditorialTemplate({ children }: MainEditorialTemplateProps) {
  const currentYear = new Date().getFullYear();
  const { displayVersion } = useAppVersion();

  return (
    <div
      className="
        flex flex-col
        h-[100dvh] w-screen
        overflow-hidden
        font-serif selection:bg-black selection:text-white
        bg-white text-black
      "
      id="main-editorial-layout"
    >
      {/* ─── Editorial Header ─── */}
      <nav className="border-b-[3px] sm:border-b-[6px] border-black flex flex-row justify-between items-center px-2 sm:px-12 py-2 sm:py-5 shrink-0 z-50 gap-2 sm:gap-0">
        <Link href="/" className="text-sm sm:text-5xl font-black uppercase tracking-tighter hover:bg-black hover:text-white transition-colors px-1 sm:px-2 text-center whitespace-nowrap overflow-hidden text-ellipsis">
          {DEFAULT_SHOP_CONFIG.shopName}
        </Link>
        
        <div className="flex font-bold uppercase text-[8px] sm:text-sm border-[2px] sm:border-[6px] border-black bg-white shrink-0">
          <Link href="/queue" className="px-2 sm:px-10 py-1 sm:py-3 border-r-[2px] sm:border-r-[6px] border-black hover:bg-black hover:text-white transition-colors flex items-center justify-center">
            <span>MONITOR</span>
          </Link>
          <Link href="/track" className="px-2 sm:px-10 py-1 sm:py-3 border-r-[2px] sm:border-r-[6px] border-black hover:bg-black hover:text-white transition-colors flex items-center justify-center">
            <span>TRACK</span>
          </Link>
          <Link href="/admin" className="px-2 sm:px-10 py-1 sm:py-3 hover:bg-black hover:text-white transition-colors flex items-center justify-center">
            <span>ADMIN</span>
          </Link>
        </div>
      </nav>

      {/* ─── Content Area ─── */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative" id="main-content">
        {children}
      </main>

      {/* ─── Editorial Footer ─── */}
      <footer className="border-t-[4px] sm:border-t-[6px] border-black bg-white text-black px-2 sm:px-8 py-2.5 sm:py-5 font-black uppercase text-[8px] sm:text-sm md:text-base text-center shrink-0 flex flex-row justify-between items-center gap-2 overflow-hidden">
        <p className="tracking-widest truncate text-left">© {currentYear} QUICK QUEUE // {displayVersion}</p>
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <span className="hidden sm:block w-4 h-4 bg-black"></span>
          <a 
            href="https://cleancode1986-portfolio.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:bg-black hover:text-white px-1.5 sm:px-2 py-0.5 sm:py-1 transition-colors inline-block border-[2px] sm:border-[3px] border-transparent hover:border-black"
          >
            DESIGNED BY CLEANCODE
          </a>
        </div>
      </footer>
    </div>
  );
}

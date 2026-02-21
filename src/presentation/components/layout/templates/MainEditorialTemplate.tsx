import Link from 'next/link';

export interface MainEditorialTemplateProps {
  children: React.ReactNode;
}

export function MainEditorialTemplate({ children }: MainEditorialTemplateProps) {
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
      <nav className="border-b-[4px] sm:border-b-[6px] border-black flex flex-col sm:flex-row justify-between items-center px-4 sm:px-12 py-3 sm:py-5 shrink-0 z-50 gap-3 sm:gap-0">
        <Link href="/" className="text-2xl sm:text-5xl font-black uppercase tracking-tighter hover:bg-black hover:text-white transition-colors px-2 text-center">
          QUEUE.EDITION
        </Link>
        
        <div className="flex font-bold uppercase text-[10px] sm:text-sm border-[3px] sm:border-[6px] border-black bg-white w-full sm:w-auto">
          <Link href="/queue" className="flex-1 sm:flex-none px-2 sm:px-10 py-2 sm:py-3 border-r-[3px] sm:border-r-[6px] border-black hover:bg-black hover:text-white transition-colors flex items-center justify-center">
            <span>MONITOR</span>
          </Link>
          <Link href="/admin" className="flex-1 sm:flex-none px-2 sm:px-10 py-2 sm:py-3 hover:bg-black hover:text-white transition-colors flex items-center justify-center">
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
        <p className="tracking-widest truncate text-left">© QUICK QUEUE MANIFESTO // ISSUE 01</p>
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

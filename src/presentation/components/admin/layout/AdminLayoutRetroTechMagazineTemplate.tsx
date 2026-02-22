import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminLayout } from './AdminLayoutContext';

export function AdminLayoutRetroTechMagazineTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isSidebarOpen, setIsSidebarOpen, toggleSidebar, setIsLogoutModalOpen } = useAdminLayout();

  const navItems = [
    { label: 'CONTROL.PANEL', href: '/admin', icon: '⚡' },
    { label: 'REQ.QUEUE', href: '/admin/pending-requests', icon: '⏳' },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-0 bg-[#f4f4f0] text-[#111] overflow-hidden font-sans" style={{
      backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
      backgroundSize: '20px 20px',
    }}>
      
      {/* Mobile Header (Retro Style) */}
      <div className="lg:hidden shrink-0 sticky top-0 left-0 right-0 h-16 bg-[#00FFFF] border-b-[4px] border-black flex items-center justify-between px-4 z-40 xl:shadow-[4px_4px_0_0_rgba(0,0,0,1)] shadow-none">
        <h1 className="text-xl font-black uppercase tracking-widest text-black" style={{ WebkitTextStroke: '1px black' }}>
          SYS<span className="text-[#FF00FF]">.ADMIN</span>
        </h1>
        <button onClick={toggleSidebar} className="p-2 border-[3px] border-black bg-white hover:bg-[#FF00FF] hover:text-white transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
          <svg className="w-5 h-5 font-black flex items-center justify-center stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeLinejoin="miter" d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar (Retro) */}
      <aside className={`
        fixed lg:static top-0 left-0 bottom-0 z-50
        w-64 bg-white border-r-[4px] lg:border-r-8 border-black
        transform transition-transform duration-200
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col shadow-[8px_0px_0_0_rgba(0,0,0,1)] lg:shadow-none
      `}>
        <div className="p-6 h-20 sm:h-24 flex items-end border-b-[4px] border-black bg-[#FF00FF]">
           <h1 className="text-3xl font-black uppercase tracking-tighter text-[#00FFFF]" style={{ WebkitTextStroke: '1.5px black' }}>
             SYS<br/><span className="text-white">.ADMIN</span>
           </h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-4 overflow-y-auto bg-white">
          <div className="text-[10px] font-black uppercase tracking-widest opacity-50 px-2">MENU.SYSTEM</div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 border-[3px] border-black text-sm font-black uppercase tracking-widest transition-all
                  ${isActive 
                    ? 'bg-[#39FF14] text-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]' 
                    : 'bg-white text-black hover:bg-[#00FFFF] shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px]'}
                `}
                onClick={() => setIsSidebarOpen(false)}
              >
                <div className="w-6 h-6 flex items-center justify-center border-r-[2px] border-black pr-3">{item.icon}</div>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t-[4px] border-black bg-[#f0f0f0]">
          <button 
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white text-black hover:bg-black hover:text-[#00FFFF] border-[3px] border-black font-black uppercase tracking-widest text-sm transition-colors shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
          >
            <span className="text-lg">🚪</span>
            SYS.EXIT()
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative w-full h-full">
        {children}
      </main>
    </div>
  );
}

import { useAdminLayoutStore } from '@/src/presentation/hooks/useAdminLayoutStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminLayoutEditorialTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isSidebarOpen, setIsSidebarOpen, toggleSidebar, setIsLogoutModalOpen } = useAdminLayoutStore();

  const navItems = [
    { label: 'แผงควบคุม', href: '/admin' },
    { label: 'คำขอบัตรคิว', href: '/admin/pending-requests' },
    { label: 'จัดการคิว', href: '/admin/queues' },
    { label: 'โหมดหน้าจอพนักงาน', href: '/admin/focus' },
    { label: 'Kiosk Mode', href: '/admin/kiosk' },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-0 font-serif bg-gray-100 text-black selection:bg-black selection:text-white overflow-hidden">
      
      {/* Mobile Header (Editorial Style) */}
      <div className="lg:hidden shrink-0 sticky top-0 left-0 right-0 h-16 bg-white border-b-[4px] border-black flex items-center justify-between px-4 z-40 shadow-[4px_4px_0_0_rgba(0,0,0,0.05)]">
        <h1 className="text-2xl font-black uppercase tracking-tighter leading-none flex items-center gap-1">
          QUICK<span className="bg-black text-white px-2 -skew-x-[15deg] py-0.5">QUEUE</span>
        </h1>
        <button onClick={toggleSidebar} className="p-2 border-[2px] border-black bg-white hover:bg-black hover:text-white transition-colors">
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

      {/* Sidebar (Editorial) */}
      <aside className={`
        fixed lg:static top-0 left-0 bottom-0 z-50
        w-64 bg-white border-r-[4px] lg:border-r-[8px] border-black
        transform transition-transform duration-200
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col shadow-[8px_0px_0_0_rgba(0,0,0,0.05)] lg:shadow-none
      `}>
        <div className="p-6 h-20 sm:h-24 flex items-end border-b-[4px] lg:border-b-[8px] border-black bg-white relative overflow-hidden group">
           <h1 className="text-3xl font-black uppercase tracking-tighter leading-none flex flex-col gap-1 relative z-10 w-full group-hover:scale-105 transition-transform origin-left">
             QUICK<span className="bg-black text-white px-2 w-max -skew-x-[15deg]">QUEUE</span>
           </h1>
           <div className="absolute top-1 right-2 text-[10px] font-bold text-gray-400">EST. 2026</div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto bg-white">
          <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 px-2">
            — MAIN MENU
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`
                  block w-full text-left px-4 py-3 border-[3px] font-black uppercase tracking-widest text-sm transition-all
                  ${isActive 
                    ? 'border-black bg-black text-white translate-x-1 shadow-[4px_4px_0_0_rgba(0,0,0,0.1)]' 
                    : 'border-transparent text-gray-600 hover:border-black hover:text-black hover:translate-x-1 hover:shadow-[4px_4px_0_0_rgba(0,0,0,0.05)]'}
                `}
                onClick={() => setIsSidebarOpen(false)}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t-[4px] lg:border-t-[8px] border-black bg-gray-50">
          <button 
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full text-center px-4 py-3 border-[3px] border-black bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0_0_rgba(0,0,0,0.05)] active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative w-full h-full bg-gray-100">
        {children}
      </main>
    </div>
  );
}

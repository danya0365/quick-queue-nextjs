import { useAdminLayoutStore } from '@/src/presentation/hooks/useAdminLayoutStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminLayoutClassicTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isSidebarOpen, setIsSidebarOpen, toggleSidebar, setIsLogoutModalOpen } = useAdminLayoutStore();

  const navItems = [
    { label: 'แผงควบคุม', href: '/admin', icon: '⚙️' },
    { label: 'คำขอบัตรคิว', href: '/admin/pending-requests', icon: '⏳' },
    { label: 'จัดการคิว', href: '/admin/queues', icon: '📋' },
    { label: 'โหมดหน้าจอพนักงาน', href: '/admin/focus', icon: '🖥️' },
    { label: 'Kiosk Mode', href: '/admin/kiosk', icon: '📺' },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-0 bg-background text-foreground overflow-hidden font-sans">
      
      {/* Mobile Header */}
      <div className="lg:hidden shrink-0 sticky top-0 left-0 right-0 h-16 bg-surface border-b border-border flex items-center justify-between px-4 z-40">
        <h1 className="text-xl font-bold">QuickQueue</h1>
        <button onClick={toggleSidebar} className="p-2 -mr-2 text-muted hover:text-foreground">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static top-0 left-0 bottom-0 z-50
        w-64 bg-surface border-r border-border
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        <div className="p-6 h-16 flex items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            QuickQueue
          </h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-primary/10 text-primary font-bold shadow-sm' 
                    : 'text-muted hover:bg-surface-alt hover:text-foreground'}
                `}
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button 
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors font-medium"
          >
            <span className="text-lg">🚪</span>
            ออกจากระบบ
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative">
        {children}
      </main>
    </div>
  );
}

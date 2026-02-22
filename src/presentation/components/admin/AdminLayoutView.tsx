'use client';

import { LoginGate } from '@/src/presentation/components/admin/LoginGate';
import { useAdminLayoutStore } from '@/src/presentation/hooks/useAdminLayoutStore';
import { useAdminLayoutPresenter } from '@/src/presentation/presenters/admin/useAdminLayoutPresenter';
import { ReactNode } from 'react';
import { AdminLayoutClassicTemplate } from './layout/AdminLayoutClassicTemplate';
import { AdminLayoutEditorialTemplate } from './layout/AdminLayoutEditorialTemplate';
import { AdminLayoutRetroTechMagazineTemplate } from './layout/AdminLayoutRetroTechMagazineTemplate';

function AdminLayoutModalContainer({ children, template }: { children: ReactNode, template: string }) {
  const { isLogoutModalOpen, setIsLogoutModalOpen } = useAdminLayoutStore();
  const { handleLogout } = useAdminLayoutPresenter();

  return (
    <>
      {children}
      
      {/* Retro Theme Modal */}
      {isLogoutModalOpen && template === 'retroTechMagazine' && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-[#f0f0f0] border-[4px] border-black p-6 md:p-8 max-w-sm w-full shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex flex-col items-center">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-[#FF00FF]" style={{ WebkitTextStroke: '1.5px black' }}>
              SYS.EXIT?
            </h2>
            <p className="text-black font-bold uppercase tracking-widest mb-8 text-center border-b-[4px] border-black pb-4 w-full text-sm">
              CONFIRM LOGOUT SEQUENCE
            </p>
            <div className="flex gap-4 w-full">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-3 px-4 bg-white text-black border-[3px] border-black font-black uppercase tracking-widest text-xs sm:text-sm hover:bg-[#00FFFF] transition-colors shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
              >
                CANCEL
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 px-4 bg-[#FF00FF] text-white border-[3px] border-black font-black uppercase tracking-widest text-xs sm:text-sm hover:bg-black hover:text-[#00FFFF] transition-colors shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
              >
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editorial Theme Modal */}
      {isLogoutModalOpen && template === 'editorial' && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex animate-in fade-in duration-200">
          <div className="bg-white m-auto p-8 max-w-md w-full border-[4px] md:border-[8px] border-black shadow-[12px_12px_0_0_rgba(0,0,0,0.05)] animate-in zoom-in-95 duration-200 font-serif">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-2 text-center leading-none">
              ออกจากระบบ
            </h2>
            <div className="w-16 h-1 bg-black mx-auto mb-6"></div>
            <p className="text-gray-900 mb-8 text-center text-lg tracking-wide border-y-[2px] border-gray-100 py-4">
              คุณต้องการออกจากระบบและกลับสู่หน้าแรกใช่หรือไม่?
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-4 px-6 border-[3px] border-black font-black uppercase tracking-widest text-sm hover:bg-gray-100 transition-colors"
              >
                — ยกเลิก
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-4 px-6 bg-black text-white border-[3px] border-black font-black uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                ยืนยันการออก —
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Classic Theme Modal */}
      {isLogoutModalOpen && template === 'classic' && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-[100] flex animate-in fade-in duration-200 font-sans">
          <div className="bg-surface m-auto p-6 md:p-8 max-w-sm w-full rounded-2xl shadow-xl border border-border animate-in slide-in-from-bottom-4 duration-300">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2 text-center text-foreground">
              ยืนยันการออกจากระบบ
            </h2>
            <p className="text-muted text-center mb-6">
              คุณแน่ใจหรือไม่ที่จะออกจากระบบเซสชันนี้?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-border text-foreground hover:bg-surface-alt font-medium transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-500 text-white hover:bg-red-600 font-medium transition-colors shadow-sm shadow-red-500/20"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface AdminLayoutViewProps {
  children: ReactNode;
}

export function AdminLayoutView({ children }: AdminLayoutViewProps) {
  const presenter = useAdminLayoutPresenter();

  // ─── Auth checking spinner ───
  if (presenter.authChecking) {
    return (
      <div className="flex-1 flex items-center justify-center h-screen w-full bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted text-sm">ตรวจสอบเซสชัน...</p>
        </div>
      </div>
    );
  }

  // ─── Auth Gate ───
  if (!presenter.isAuthenticated) {
    return (
      <div className="h-screen w-full bg-background">
        <LoginGate onLogin={presenter.handleLogin} />
      </div>
    );
  }

  return (
    <AdminLayoutModalContainer template={presenter.template}>
      {presenter.template === 'retroTechMagazine' && (
        <AdminLayoutRetroTechMagazineTemplate>{children}</AdminLayoutRetroTechMagazineTemplate>
      )}
      {presenter.template === 'editorial' && (
        <AdminLayoutEditorialTemplate>{children}</AdminLayoutEditorialTemplate>
      )}
      {presenter.template === 'classic' && (
        <AdminLayoutClassicTemplate>{children}</AdminLayoutClassicTemplate>
      )}
    </AdminLayoutModalContainer>
  );
}

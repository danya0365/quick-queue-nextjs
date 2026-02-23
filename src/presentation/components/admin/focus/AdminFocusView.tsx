'use client';

import { useAdminLayoutPresenter } from '@/src/presentation/presenters/admin/useAdminLayoutPresenter';
import { useAdminPresenter } from '@/src/presentation/presenters/admin/useAdminPresenter';
import { AdminFocusClassicTemplate } from './templates/AdminFocusClassicTemplate';
import { AdminFocusEditorialTemplate } from './templates/AdminFocusEditorialTemplate';
import { AdminFocusRetroTechMagazineTemplate } from './templates/AdminFocusRetroTechMagazineTemplate';

export function AdminFocusView() {
  const [state, actions] = useAdminPresenter(undefined, 'queues');
  const [layoutState] = useAdminLayoutPresenter();
  
  const viewModel = state.viewModel;

  if (state.loading && !viewModel) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 font-sans space-y-4">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <div className="text-xl font-medium animate-pulse">กำลังโหลดระบบ...</div>
      </div>
    );
  }

  if (!viewModel) return null;

  const templateProps = {
    viewModel,
    state,
    actions,
  };

  // Render the template based on the globally active theme
  switch (layoutState.template) {
    case 'retroTechMagazine':
      return <AdminFocusRetroTechMagazineTemplate {...templateProps} />;
    case 'editorial':
      return <AdminFocusEditorialTemplate {...templateProps} />;
    case 'classic':
    default:
      return <AdminFocusClassicTemplate {...templateProps} />;
  }
}

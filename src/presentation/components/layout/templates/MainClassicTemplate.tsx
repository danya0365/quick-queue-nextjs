import { FooterClassicTemplate } from './FooterClassicTemplate';
import { HeaderClassicTemplate } from './HeaderClassicTemplate';
import { MobileBottomNavClassicTemplate } from './MobileBottomNavClassicTemplate';

export interface MainClassicTemplateProps {
  children: React.ReactNode;
}

export function MainClassicTemplate({ children }: MainClassicTemplateProps) {
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
      <HeaderClassicTemplate />

      {/* Content Area - scrolls internally */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative" id="main-content">
        {children}
      </main>

      <FooterClassicTemplate />
      <MobileBottomNavClassicTemplate />
    </div>
  );
}

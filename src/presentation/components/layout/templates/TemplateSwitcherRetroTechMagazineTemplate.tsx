import { animated, useTransition } from 'react-spring';
import { TemplateSwitcherLayoutProps } from '../TemplateSwitcher';

export function TemplateSwitcherRetroTechMagazineTemplate({
  isOpen,
  onToggle,
  onSelect,
  templates,
  currentTemplate,
}: TemplateSwitcherLayoutProps) {
  const transitions = useTransition(isOpen, {
    from: { opacity: 0, transform: 'translateY(5px)' },
    enter: { opacity: 1, transform: 'translateY(0px)' },
    leave: { opacity: 0, transform: 'translateY(5px)' },
    config: { tension: 400, friction: 30 },
  });

  return (
    <div className="relative flex flex-col items-end">
      {/* Dropdown Menu */}
      {transitions(
        (style, item) =>
          item && (
            <animated.div
              style={style}
              className="absolute bottom-full right-0 mb-3 w-48 bg-white border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] z-50 pointer-events-auto"
            >
              <div className="flex flex-col">
                {templates.map((tpl, index) => (
                  <button
                    key={tpl.id}
                    onClick={() => onSelect(tpl.id)}
                    className={`
                      text-left px-4 py-3 text-xs font-black uppercase tracking-widest transition-colors
                      ${index !== 0 ? 'border-t-4 border-black' : ''}
                      ${
                        currentTemplate === tpl.id
                          ? 'bg-[#39FF14] text-black hover:bg-[#FF00FF] hover:text-white'
                          : 'bg-white text-black hover:bg-black hover:text-white'
                      }
                    `}
                  >
                    {currentTemplate === tpl.id ? `> ${tpl.label}` : `  ${tpl.label}`}
                  </button>
                ))}
              </div>
            </animated.div>
          )
      )}

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        title="เปลี่ยนสไตล์"
        className={`
          transition-all duration-300 active:scale-95 flex items-center justify-center
          w-12 h-12 sm:w-14 sm:h-14
          ${isOpen ? 'bg-[#FF00FF] text-white translate-x-[2px] translate-y-[2px] shadow-[2px_2px_0_0_rgba(0,0,0,1)]' : 'bg-[#00FFFF] text-black hover:bg-[#FF00FF] hover:text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)]'} 
          border-4 border-black 
          ${!isOpen ? 'shadow-[4px_4px_0_0_rgba(0,0,0,1)]' : ''} 
        `}
      >
        <span className={`w-3 h-3 bg-current ${isOpen ? 'animate-none' : 'animate-ping'}`}></span>
      </button>
    </div>
  );
}

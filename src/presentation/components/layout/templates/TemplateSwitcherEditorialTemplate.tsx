import { animated, useTransition } from 'react-spring';
import { TemplateSwitcherLayoutProps } from '../TemplateSwitcher';

export function TemplateSwitcherEditorialTemplate({
  isOpen,
  onToggle,
  onSelect,
  templates,
  currentTemplate,
}: TemplateSwitcherLayoutProps) {
  const transitions = useTransition(isOpen, {
    from: { opacity: 0, transform: 'translateY(10px)' },
    enter: { opacity: 1, transform: 'translateY(0px)' },
    leave: { opacity: 0, transform: 'translateY(10px)' },
    config: { tension: 400, friction: 30 },
  });

  return (
    <div className="relative flex flex-col items-end font-sans">
      {/* Dropdown Menu */}
      {transitions(
        (style, item) =>
          item && (
            <animated.div
              style={style}
              className="absolute bottom-full right-0 mb-4 w-48 bg-white border-[4px] border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] z-50 pointer-events-auto"
            >
              <div className="flex flex-col">
                {templates.map((tpl, index) => (
                  <button
                    key={tpl.id}
                    onClick={() => onSelect(tpl.id)}
                    className={`
                      text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-colors
                      ${index !== 0 ? 'border-t-[4px] border-black' : ''}
                      ${
                        currentTemplate === tpl.id
                          ? 'bg-black text-white hover:bg-gray-900'
                          : 'bg-white text-black hover:bg-gray-100'
                      }
                    `}
                  >
                    {currentTemplate === tpl.id ? `• ${tpl.label}` : `  ${tpl.label}`}
                  </button>
                ))}
              </div>
            </animated.div>
          )
      )}

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        title="Change Style"
        className={`
          transition-all duration-300 active:translate-y-1 flex justify-center items-center
          w-12 h-12 sm:w-14 sm:h-14 rounded-full border-[3px] sm:border-[4px] border-black
          ${isOpen ? 'bg-black text-white shadow-none translate-x-[4px] translate-y-[4px]' : 'bg-white text-black hover:bg-black hover:text-white shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:shadow-[8px_8px_0_0_rgba(0,0,0,1)]'} 
          font-black text-xl sm:text-2xl z-10
        `}
      >
        <span className="leading-none mt-1">S</span>
      </button>
    </div>
  );
}

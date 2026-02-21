import { animated, useSpring } from 'react-spring';
import { TemplateSwitcherLayoutProps } from '../TemplateSwitcher';

export function TemplateSwitcherRetroTechMagazineTemplate({
  isOpen,
  onToggle,
  onSelect,
  templates,
  currentTemplate,
}: TemplateSwitcherLayoutProps) {
  const dropdownSpring = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translateY(0px)' : 'translateY(5px)',
    config: { tension: 400, friction: 30 },
  });

  return (
    <div className="relative flex flex-col items-end">
      {/* Dropdown Menu */}
      <animated.div
        style={dropdownSpring}
        className={`
          ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}
          mb-3 w-48 bg-white border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]
        `}
      >
        <div className="flex flex-col">
          {templates.map((tpl, index) => (
            <button
              key={tpl.id}
              onClick={() => onSelect(tpl.id)}
              className={`
                text-left px-4 py-3 text-sm font-black uppercase tracking-widest transition-colors
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

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={`
          transition-all duration-300 active:scale-95 flex items-center gap-2 
          ${isOpen ? 'bg-[#FF00FF] text-white translate-x-[2px] translate-y-[2px] shadow-[2px_2px_0_0_rgba(0,0,0,1)]' : 'bg-[#00FFFF] text-black'} 
          font-black uppercase text-xs sm:text-sm px-4 py-3 border-4 border-black 
          ${!isOpen ? 'shadow-[4px_4px_0_0_rgba(0,0,0,1)]' : ''} 
          hover:bg-[#FF00FF] hover:text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)]
        `}
      >
        <span className="flex items-center gap-2">
          <span className={`w-2 h-2 bg-current ${isOpen ? 'animate-none' : 'animate-ping'}`}></span>
          TEMPLATES
        </span>
      </button>
    </div>
  );
}

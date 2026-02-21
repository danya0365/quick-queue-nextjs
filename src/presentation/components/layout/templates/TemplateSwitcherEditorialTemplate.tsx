import { animated, useSpring } from 'react-spring';
import { TemplateSwitcherLayoutProps } from '../TemplateSwitcher';

export function TemplateSwitcherEditorialTemplate({
  isOpen,
  onToggle,
  onSelect,
  templates,
  currentTemplate,
}: TemplateSwitcherLayoutProps) {
  const dropdownSpring = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translateY(0px)' : 'translateY(10px)',
    config: { tension: 400, friction: 30 },
  });

  return (
    <div className="relative flex flex-col items-end font-sans">
      {/* Dropdown Menu */}
      <animated.div
        style={dropdownSpring}
        className={`
          ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}
          mb-4 w-56 bg-white border-[6px] border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)]
        `}
      >
        <div className="flex flex-col">
          {templates.map((tpl, index) => (
            <button
              key={tpl.id}
              onClick={() => onSelect(tpl.id)}
              className={`
                text-left px-5 py-4 text-sm font-black uppercase tracking-widest transition-colors
                ${index !== 0 ? 'border-t-[6px] border-black' : ''}
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

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={`
          transition-all duration-300 active:translate-y-1 flex items-center gap-3 
          ${isOpen ? 'bg-black text-white shadow-[0px_0px_0_0_rgba(0,0,0,1)] translate-x-[4px] translate-y-[4px]' : 'bg-white text-black shadow-[8px_8px_0_0_rgba(0,0,0,1)]'} 
          font-black uppercase text-sm sm:text-base px-6 py-4 border-[6px] border-black 
          hover:bg-black hover:text-white group
        `}
      >
        <span className="flex items-center gap-2">
          <span className={`w-3 h-3 border-[3px] border-current ${isOpen ? 'bg-white' : 'bg-black group-hover:bg-white'}`}></span>
          STYLE : {isOpen ? 'SELECT' : 'EDIT'}
        </span>
      </button>
    </div>
  );
}

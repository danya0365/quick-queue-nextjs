import { animated, useSpring } from 'react-spring';
import { TemplateSwitcherLayoutProps } from '../TemplateSwitcher';

export function TemplateSwitcherClassicTemplate({
  isOpen,
  onToggle,
  onSelect,
  templates,
  currentTemplate,
}: TemplateSwitcherLayoutProps) {
  const dropdownSpring = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translateY(0px)' : 'translateY(10px)',
    config: { tension: 300, friction: 20 },
  });

  return (
    <div className="relative flex flex-col items-end">
      {/* Dropdown Menu */}
      <animated.div
        style={dropdownSpring}
        className={`
          ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}
          mb-3 w-48 bg-surface dark:bg-surface-alt border border-border rounded-2xl shadow-xl overflow-hidden backdrop-blur-md
        `}
      >
        <div className="p-1">
          {templates.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => onSelect(tpl.id)}
              className={`
                w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2
                ${
                  currentTemplate === tpl.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-surface-alt'
                }
              `}
            >
              {currentTemplate === tpl.id ? (
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              ) : (
                <span className="w-1.5 h-1.5" /> // spacer
              )}
              <span>{tpl.label}</span>
            </button>
          ))}
        </div>
      </animated.div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="transition-all duration-300 active:scale-95 flex items-center gap-2 bg-surface/90 dark:bg-surface-alt/90 backdrop-blur-md border border-border text-foreground px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-primary/50 hover:shadow-[0_8px_30px_rgba(var(--primary),0.2)]"
      >
        <span className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full bg-primary ${isOpen ? 'animate-none' : 'animate-pulse'}`}></span>
          Select Template
        </span>
      </button>
    </div>
  );
}

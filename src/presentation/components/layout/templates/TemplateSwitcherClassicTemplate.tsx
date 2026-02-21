import { animated, useTransition } from 'react-spring';
import { TemplateSwitcherLayoutProps } from '../TemplateSwitcher';

export function TemplateSwitcherClassicTemplate({
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
    config: { tension: 300, friction: 20 },
  });

  return (
    <div className="relative flex flex-col items-end">
      {/* Dropdown Menu */}
      {transitions(
        (style, item) =>
          item && (
            <animated.div
              style={style}
              className="absolute bottom-full right-0 mb-3 w-40 bg-surface dark:bg-surface-alt border border-border rounded-xl shadow-xl overflow-hidden backdrop-blur-md z-50 pointer-events-auto"
            >
              <div className="p-1">
                {templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => onSelect(tpl.id)}
                    className={`
                      w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2
                      ${
                        currentTemplate === tpl.id
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-surface-alt'
                      }
                    `}
                  >
                    {currentTemplate === tpl.id ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    ) : (
                      <span className="w-1.5 h-1.5 shrink-0" /> // spacer
                    )}
                    <span className="truncate">{tpl.label}</span>
                  </button>
                ))}
              </div>
            </animated.div>
          )
      )}

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        title="Change Template"
        className="transition-all duration-300 active:scale-95 flex items-center justify-center w-12 h-12 bg-surface/90 dark:bg-surface-alt/90 backdrop-blur-md border border-border text-foreground rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-primary/50 hover:shadow-[0_8px_30px_rgba(var(--primary),0.2)]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </button>
    </div>
  );
}

import { ChevronDown } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { animated, useTransition } from 'react-spring';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
  triggerClassName?: string;
  dropdownClassName?: string;
  itemClassName?: string;
  activeItemClassName?: string;
  placeholder?: string;
}

export function CustomSelect({
  value,
  onChange,
  options,
  className = '',
  triggerClassName = 'px-4 py-2 sm:py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all hover:bg-surface-alt',
  dropdownClassName = 'bg-surface dark:bg-surface-alt border border-border rounded-xl shadow-xl',
  itemClassName = 'text-foreground hover:bg-surface-alt',
  activeItemClassName = 'bg-primary/10 text-primary font-medium',
  placeholder = 'Select...',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const transitions = useTransition(isOpen, {
    from: { opacity: 0, transform: 'translateY(-10px) scale(0.95)' },
    enter: { opacity: 1, transform: 'translateY(0) scale(1)' },
    leave: { opacity: 0, transform: 'translateY(-10px) scale(0.95)' },
    config: { tension: 350, friction: 25 },
  });

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-full min-h-[40px] flex items-center justify-between gap-3 ${triggerClassName}`}
      >
        <span className="flex items-center gap-2 truncate text-foreground font-medium">
          {selectedOption?.icon && <span className="w-4 h-4 text-muted shrink-0 flex items-center justify-center">{selectedOption.icon}</span>}
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {transitions(
        (style, item) =>
          item && (
            <animated.div
              style={style}
              className={`absolute z-50 top-full right-0 sm:left-0 sm:right-auto mt-2 p-1 overflow-hidden backdrop-blur-md min-w-full sm:min-w-[180px] ${dropdownClassName}`}
            >
              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2
                      ${
                        value === option.value
                          ? activeItemClassName
                          : itemClassName
                      }
                    `}
                  >
                    {option.icon && (
                      <span className={`w-4 h-4 shrink-0 flex items-center justify-center ${value === option.value ? 'text-primary' : 'text-muted'}`}>
                        {option.icon}
                      </span>
                    )}
                    <span className="truncate">{option.label}</span>
                    {value === option.value && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </animated.div>
          )
      )}
    </div>
  );
}

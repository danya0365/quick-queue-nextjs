'use client';

import { AppTemplate, useTemplate } from '@/src/presentation/hooks/useTemplate';
import { useEffect, useRef, useState } from 'react';
import { TemplateSwitcherClassicTemplate } from './templates/TemplateSwitcherClassicTemplate';
import { TemplateSwitcherEditorialTemplate } from './templates/TemplateSwitcherEditorialTemplate';
import { TemplateSwitcherRetroTechMagazineTemplate } from './templates/TemplateSwitcherRetroTechMagazineTemplate';

export type TemplateOption = { id: AppTemplate; label: string; };

export interface TemplateSwitcherLayoutProps {
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (template: AppTemplate) => void;
  templates: TemplateOption[];
  currentTemplate: AppTemplate;
}

export function TemplateSwitcher() {
  const { template, setTemplate } = useTemplate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const handleSelect = (newTemplate: AppTemplate) => {
    setTemplate(newTemplate);
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const templates: TemplateOption[] = [
    { id: 'editorial', label: 'Editorial Mode' },
    { id: 'retroTechMagazine', label: 'Retro Mode' },
    { id: 'classic', label: 'Classic Mode' },
  ];

  const commonProps = {
    isOpen,
    onToggle: toggleDropdown,
    onSelect: handleSelect,
    templates,
    currentTemplate: template,
  };

  const getBottomPosition = () => {
    switch (template) {
      case 'retroTechMagazine':
        return 'bottom-22 sm:bottom-24'; // Retro footer is taller
      case 'editorial':
        return 'bottom-18 sm:bottom-24'; // Editorial footer
      case 'classic':
      default:
        return 'bottom-24 sm:bottom-18'; // Classic footer + mobile nav consideration
    }
  };

  return (
    <div ref={dropdownRef} className={`fixed right-6 sm:right-8 z-[100] transition-all duration-300 ${getBottomPosition()}`}>
      {template === 'retroTechMagazine' && (
        <TemplateSwitcherRetroTechMagazineTemplate {...commonProps} />
      )}
      {template === 'editorial' && (
        <TemplateSwitcherEditorialTemplate {...commonProps} />
      )}
      {template === 'classic' && (
        <TemplateSwitcherClassicTemplate {...commonProps} />
      )}
    </div>
  );
}

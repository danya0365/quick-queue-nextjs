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
    { id: 'classic', label: 'Classic Mode' },
    { id: 'retroTechMagazine', label: 'Retro Mode' },
    { id: 'editorial', label: 'Editorial Mode' },
  ];

  const commonProps = {
    isOpen,
    onToggle: toggleDropdown,
    onSelect: handleSelect,
    templates,
    currentTemplate: template,
  };

  return (
    <div ref={dropdownRef} className="fixed bottom-16 sm:bottom-20 right-4 sm:right-6 z-[100]">
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

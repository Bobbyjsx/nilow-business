'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ColorSelectorProps {
  defaultColor?: string;
  onChange?: (color: string) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

// Color palette organized by color groups
const colorGroups = [
  {
    name: 'Red',
    colors: ['#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d'],
  },
  {
    name: 'Orange',
    colors: ['#fed7aa', '#fdba74', '#fb923c', '#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12'],
  },
  {
    name: 'Amber',
    colors: ['#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f'],
  },
  {
    name: 'Yellow',
    colors: ['#fef08a', '#fde047', '#facc15', '#eab308', '#ca8a04', '#a16207', '#854d0e', '#713f12'],
  },
  {
    name: 'Lime',
    colors: ['#d9f99d', '#bef264', '#a3e635', '#84cc16', '#65a30d', '#4d7c0f', '#3f6212', '#365314'],
  },
  {
    name: 'Green',
    colors: ['#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d'],
  },
  {
    name: 'Emerald',
    colors: ['#a7f3d0', '#6ee7b7', '#34d399', '#10b981', '#059669', '#047857', '#065f46', '#064e3b'],
  },
  {
    name: 'Teal',
    colors: ['#99f6e4', '#5eead4', '#2dd4bf', '#14b8a6', '#0d9488', '#0f766e', '#115e59', '#134e4a'],
  },
  {
    name: 'Cyan',
    colors: ['#a5f3fc', '#67e8f9', '#22d3ee', '#06b6d4', '#0891b2', '#0e7490', '#155e75', '#164e63'],
  },
  {
    name: 'Sky',
    colors: ['#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e'],
  },
  {
    name: 'Blue',
    colors: ['#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a'],
  },
  {
    name: 'Indigo',
    colors: ['#c7d2fe', '#a5b4fc', '#818cf8', '#6366f1', '#4f46e5', '#4338ca', '#3730a3', '#312e81'],
  },
  {
    name: 'Violet',
    colors: ['#ddd6fe', '#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95'],
  },
  {
    name: 'Purple',
    colors: ['#e9d5ff', '#d8b4fe', '#c084fc', '#a855f7', '#9333ea', '#7e22ce', '#6b21a8', '#581c87'],
  },
  {
    name: 'Fuchsia',
    colors: ['#f5d0fe', '#f0abfc', '#e879f9', '#d946ef', '#c026d3', '#a21caf', '#86198f', '#701a75'],
  },
  {
    name: 'Pink',
    colors: ['#fbcfe8', '#f9a8d4', '#f472b6', '#ec4899', '#db2777', '#be185d', '#9d174d', '#831843'],
  },
  {
    name: 'Rose',
    colors: ['#fecdd3', '#fda4af', '#fb7185', '#f43f5e', '#e11d48', '#be123c', '#9f1239', '#881337'],
  },
  {
    name: 'Gray',
    colors: ['#f9fafb', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#4b5563', '#374151', '#1f2937', '#111827'],
  },
];

export default function ColorSelector({ defaultColor = '#3b82f6', onChange, label, className, disabled }: ColorSelectorProps) {
  const [color, setColor] = useState(defaultColor);
  const [activeTab, setActiveTab] = useState('palette');
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Ensure color has # prefix
  useEffect(() => {
    if (color && !color.startsWith('#')) {
      setColor(`#${color}`);
    }
  }, [color]);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    if (onChange) {
      onChange(newColor);
    }
  };

  const handleLabelClick = () => {
    if (triggerRef.current && !disabled) {
      triggerRef.current.click();
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      {label && (
        <label
          onClick={handleLabelClick}
          className={`
            absolute left-4 px-1 text-gray-500 bg-background transition-all duration-300 z-10 cursor-text
            ${isOpen || color ? '-top-2 text-sm font-medium' : 'top-1/2 -translate-y-1/2 text-base'}
            ${disabled ? '!bg-gray-50' : ''}
          `}
        >
          {label}
        </label>
      )}

      <Popover
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <PopoverTrigger asChild>
          <button
            ref={triggerRef}
            disabled={disabled}
            className={cn(
              'flex items-center justify-between w-full h-14 px-4 py-2 text-left border rounded-md',
              'focus:outline-none focus:ring-0 transition-all duration-200',
              isOpen ? 'border-primary' : 'border-input',
              disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-background ',
              className,
            )}
          >
            <div className='flex items-center gap-3'>
              <div
                className='h-5 w-5 rounded-full border shadow-sm'
                style={{ backgroundColor: color }}
              />
              <span className='font-mono'>{color}</span>
            </div>
            <ChevronDown className='h-4 w-4 opacity-70' />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className='p-0 shadow-lg w-full'
          align='start'
        >
          <Tabs
            defaultValue='palette'
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <div className='border-b px-3'>
              <TabsList className='h-10 bg-transparent'>
                <TabsTrigger
                  value='palette'
                  className='data-[state=active]:bg-background'
                >
                  Palette
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent
              value='palette'
              className='max-h-[300px] overflow-y-auto p-3'
            >
              <div className='space-y-3'>
                {colorGroups.map((group) => (
                  <div
                    key={group.name}
                    className='space-y-1.5'
                  >
                    <div className='flex items-center gap-2'>
                      <span className='text-xs font-medium text-muted-foreground'>{group.name}</span>
                      <Separator className='flex-1' />
                    </div>
                    <div className='grid grid-cols-8 gap-1'>
                      {group.colors.map((paletteColor) => (
                        <button
                          key={paletteColor}
                          className={cn(
                            'h-5 w-5 rounded-full border transition-all hover:scale-110 hover:shadow-md',
                            color === paletteColor && 'ring-2 ring-primary ring-offset-1',
                          )}
                          style={{ backgroundColor: paletteColor }}
                          onClick={() => handleColorChange(paletteColor)}
                          aria-label={`Select color ${paletteColor}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  );
}

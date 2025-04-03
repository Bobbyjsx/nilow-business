/**
 * Calendar constants and utility functions
 */

// Time format options
export const TIME_FORMATS = {
  HOUR_12: 'h:mm a',
  HOUR_24: 'HH:mm',
};

// Default calendar settings
export const DEFAULT_CALENDAR_SETTINGS = {
  startHour: 8,
  endHour: 20,
  timeFormat: TIME_FORMATS.HOUR_12,
  disabledTimeSlots: [],
};

// Event colors
export const EVENT_COLORS = {
  DEFAULT: {
    background: 'rgba(59, 130, 246, 0.15)',
    border: '#3b82f6',
    text: '#374151',
  },
  SUCCESS: {
    background: 'rgba(34, 197, 94, 0.15)',
    border: '#22c55e',
    text: '#374151',
  },
  WARNING: {
    background: 'rgba(245, 158, 11, 0.15)',
    border: '#f59e0b',
    text: '#374151',
  },
  DANGER: {
    background: 'rgba(239, 68, 68, 0.15)',
    border: '#ef4444',
    text: '#374151',
  },
};

// Time slot background patterns
export const TIME_SLOT_BACKGROUNDS = {
  WORKING_HOURS: 'bg-gradient-to-r from-white to-blue-50',
  AFTER_HOURS: 'bg-gradient-to-r from-slate-50 to-gray-50',
};

// Get background pattern for the calendar based on hour
export const getTimeSlotBackground = (hour: number): string => {
  // Different patterns for working hours vs after hours
  if (hour >= 9 && hour < 17) {
    return TIME_SLOT_BACKGROUNDS.WORKING_HOURS;
  } else {
    return TIME_SLOT_BACKGROUNDS.AFTER_HOURS;
  }
};

// CSS for custom scrollbar
export const CUSTOM_SCROLLBAR_STYLES = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(203, 213, 225, 0.5);
    border-radius: 20px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(148, 163, 184, 0.7);
  }
`;

// Animation variants for framer-motion
export const ANIMATION_VARIANTS = {
  event: {
    initial: { opacity: 0, x: 10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { type: 'spring', stiffness: 250, damping: 20 },
  },
  timeSlotHover: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
};

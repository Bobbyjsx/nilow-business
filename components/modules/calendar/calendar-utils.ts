import { format, isSameDay, isWithinInterval, parse } from 'date-fns';
import { DisabledTimeSlot } from './types';

export function generateTimeSlots(startHour: number, endHour: number) {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(hour);
  }
  return slots;
}

export function isTimeSlotDisabled(start: Date, end: Date, disabledTimeSlots: DisabledTimeSlot[]): boolean {
  if (!disabledTimeSlots || disabledTimeSlots.length === 0) {
    return false;
  }

  const day = start.getDay();
  const startTime = format(start, 'HH:mm');
  const endTime = format(end, 'HH:mm');

  return disabledTimeSlots.some((slot) => {
    // Check if day matches (if specified)
    if (slot.day !== undefined && slot.day !== day) {
      return false;
    }

    // Check if date matches (for non-recurring slots)
    if (slot.date && !isSameDay(slot.date, start)) {
      return false;
    }

    // Parse slot times
    const slotStart = parse(slot.startTime, 'HH:mm', new Date());
    const slotEnd = parse(slot.endTime, 'HH:mm', new Date());

    // Check for overlap
    const startOverlaps = isWithinInterval(parse(startTime, 'HH:mm', new Date()), { start: slotStart, end: slotEnd });

    const endOverlaps = isWithinInterval(parse(endTime, 'HH:mm', new Date()), { start: slotStart, end: slotEnd });

    const slotWithinEvent =
      parse(slot.startTime, 'HH:mm', new Date()) >= parse(startTime, 'HH:mm', new Date()) &&
      parse(slot.endTime, 'HH:mm', new Date()) <= parse(endTime, 'HH:mm', new Date());

    return startOverlaps || endOverlaps || slotWithinEvent;
  });
}

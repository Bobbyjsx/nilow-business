import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function CalendarDaySkeleton() {
  // Generate time slots for the day (typically from 8am to 8pm)
  const startHour = 8;
  const endHour = 20;
  const timeSlots = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);

  return (
    <div className='flex flex-col h-full relative bg-white rounded-lg border border-gray-100 shadow-sm'>
      {/* Header */}
      <div className='sticky top-0 z-20 bg-white px-4 py-3 border-b border-gray-100 rounded-t-lg'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-5 w-5 rounded-full' />
            <Skeleton className='h-7 w-48' />
          </div>
          <Skeleton className='h-5 w-20' />
        </div>
      </div>

      {/* Time slots */}
      <div className='flex-1 overflow-y-auto'>
        <div className='relative min-h-full'>
          {timeSlots.map((hour, index) => {
            const isTaller = index % 3 === 0; // Make some slots taller for visual variety

            return (
              <div
                key={hour}
                className={cn('grid grid-cols-[80px_1fr] border-b border-gray-100 transition-all duration-200', isTaller ? 'h-20' : 'h-16')}
              >
                <div className='flex items-start justify-end pr-4 pt-2'>
                  <Skeleton className='h-4 w-12' />
                </div>
                <div className='relative'>
                  {/* Random event placeholders */}
                  {Math.random() > 0.7 && (
                    <div
                      className='absolute left-2 right-2 rounded-lg shadow-sm px-3 py-2 overflow-hidden'
                      style={{
                        top: '10%',
                        height: '80%',
                        backgroundColor: 'rgba(59, 130, 246, 0.15)',
                        borderLeft: '4px solid #3b82f6',
                      }}
                    >
                      <Skeleton className='h-4 w-3/4 mb-2' />
                      <div className='flex items-center gap-1 mt-1'>
                        <Skeleton className='h-3 w-3 rounded-full' />
                        <Skeleton className='h-3 w-24' />
                      </div>
                      <div className='flex items-center gap-1 mt-1'>
                        <Skeleton className='h-3 w-3 rounded-full' />
                        <Skeleton className='h-3 w-20' />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Current time indicator */}
          <div
            className='absolute left-0 right-0 flex items-center pointer-events-none'
            style={{ top: '40%', zIndex: 30 }}
          >
            <div className='w-[80px] flex justify-end pr-2'>
              <div className='w-2 h-2 rounded-full bg-red-500 shadow-sm shadow-red-300 animate-pulse' />
            </div>
            <div className='flex-1 h-[2px] bg-gradient-to-r from-red-500 via-red-500 to-transparent' />
          </div>
        </div>
      </div>
    </div>
  );
}

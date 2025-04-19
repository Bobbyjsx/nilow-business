import { Skeleton } from '@/components/ui/skeleton';

export function CalendarSkeleton() {
  // Generate days of the week header
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate 5 weeks (rows) for the calendar grid
  const weeks = Array.from({ length: 5 }, (_, weekIndex) => {
    // Generate 7 days (columns) for each week
    return Array.from({ length: 7 }, (_, dayIndex) => ({
      id: weekIndex * 7 + dayIndex,
    }));
  });

  return (
    <div className='w-full max-w-4xl mx-auto space-y-6'>
      {/* Calendar header with month and navigation */}
      <div className='flex items-center justify-between mb-6'>
        <Skeleton className='h-10 w-40' />
        <div className='flex space-x-2'>
          <Skeleton className='h-10 w-10 rounded-md' />
          <Skeleton className='h-10 w-10 rounded-md' />
        </div>
      </div>

      {/* Calendar grid */}
      <div className='border rounded-lg overflow-hidden bg-card'>
        {/* Days of week header */}
        <div className='grid grid-cols-7 border-b'>
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className='py-3 text-center'
            >
              <Skeleton className='h-5 w-8 mx-auto' />
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className='grid grid-cols-7'>
          {weeks.flat().map((day) => (
            <div
              key={day.id}
              className='min-h-[100px] p-2 border-b border-r last:border-r-0 last-of-type:border-b-0'
            >
              {/* Day number */}
              <Skeleton className='h-6 w-6 rounded-full mb-2' />

              {/* Events - show 0-3 event skeletons randomly */}
              {Array.from({ length: Math.floor(Math.random() * 4) }, (_, i) => (
                <Skeleton
                  key={i}
                  className='h-5 w-full mb-1 rounded-sm'
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend or additional controls */}
      <div className='flex justify-between items-center mt-4'>
        <Skeleton className='h-8 w-32' />
        <Skeleton className='h-8 w-24' />
      </div>
    </div>
  );
}

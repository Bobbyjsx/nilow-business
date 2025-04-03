import { CalendarWithAppointments } from '@/components/modules/calendar/calendar-with-appointments';

export default function AppointmentsPage() {
  return (
    <div className='mx-auto py-6 space-y-6 px-5'>
      {/* <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Appointments</h1>
      </div> */}

      <CalendarWithAppointments />
    </div>
  );
}

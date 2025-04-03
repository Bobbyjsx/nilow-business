# Appointments Drawer Implementation

This document outlines the implementation of the appointments drawer feature for the Nilow Business application.

## Overview

The appointments drawer is a UI component that appears when a user clicks on an appointment in the calendar. It provides detailed information about the appointment and allows users to perform various actions based on the appointment's status.

## Key Features

1. **Appointment Status Management**:
   - Scheduled: Initial state of a new appointment
   - In-progress: When an appointment has started
   - Completed: When an appointment has been fulfilled
   - Cancelled: When an appointment has been cancelled

2. **Image Requirements**:
   - Before Image: Required to start an appointment
   - After Image: Required to complete an appointment

3. **Actions Available**:
   - Call customer
   - Cancel appointment
   - Begin appointment
   - Complete appointment
   - Edit appointment

4. **Status-based Restrictions**:
   - Completed appointments cannot be edited or deleted
   - Cancelled appointments cannot be edited or deleted
   - Before images can only be uploaded for scheduled appointments
   - After images can only be uploaded for in-progress appointments

5. **Customer Management**:
   - Searchable customer selection from database
   - Customer details automatically populated
   - Customer history tracking

## Component Structure

1. **AppointmentDrawer**: Main component that displays appointment details and actions
2. **AppointmentImageUpload**: Component for handling image uploads with validation
3. **AppointmentFormModal**: Unified modal for creating and editing appointments
4. **AppointmentContext**: Context provider for managing appointment state
5. **CalendarWithAppointments**: Wrapper component that connects the calendar with the appointment drawer

## Usage

To use the appointments feature in your application:

```jsx
// In your page component
import { CalendarWithAppointments } from '@/components/modules/calendar/calendar-with-appointments';

export default function AppointmentsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Appointments</h1>
      <CalendarWithAppointments />
    </div>
  );
}
```

## Workflow

1. **Creating an appointment**:
   - Click "New Appointment" button or click on a time slot in the calendar
   - Select a customer from the searchable dropdown
   - Select services and fill in appointment details
   - Click "Create" to save the appointment

2. **Managing an appointment**:
   - Click on an appointment in the calendar to open the drawer
   - For a scheduled appointment:
     - Upload a "before" image
     - Click "Begin Appointment" to change status to "in-progress"
   - For an in-progress appointment:
     - Upload an "after" image
     - Click "Complete Appointment" to change status to "completed"
   - Click the edit button to modify appointment details

## Future Enhancements

- Integration with customer database
- Automated notifications/reminders
- Payment processing integration
- Service history tracking
- Analytics and reporting

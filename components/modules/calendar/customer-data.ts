// Mock customer data for the application

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  notes?: string;
  lastVisit?: Date;
  preferredServices?: string[];
}

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust-001',
    name: 'John Smith',
    phone: '555-123-4567',
    email: 'john.smith@example.com',
    address: '123 Main St, Anytown, USA',
    notes: 'Regular customer, prefers scissors over clippers',
    lastVisit: new Date(2023, 11, 15),
    preferredServices: ['1'] // Haircut
  },
  {
    id: 'cust-002',
    name: 'Sarah Johnson',
    phone: '555-987-6543',
    email: 'sarah.j@example.com',
    address: '456 Oak Ave, Somewhere, USA',
    notes: 'Allergic to certain hair products',
    lastVisit: new Date(2024, 0, 5),
    preferredServices: ['2'] // Hair Coloring
  },
  {
    id: 'cust-003',
    name: 'Michael Brown',
    phone: '555-456-7890',
    email: 'mbrown@example.com',
    address: '789 Pine Rd, Elsewhere, USA',
    notes: 'VIP customer, always books full treatment',
    lastVisit: new Date(2024, 1, 20),
    preferredServices: ['1', '4'] // Haircut and Full Treatment
  },
  {
    id: 'cust-004',
    name: 'Emily Davis',
    phone: '555-222-3333',
    email: 'emily.d@example.com',
    address: '321 Elm St, Nowhere, USA',
    notes: 'New customer',
    preferredServices: ['3'] // Beard Trim
  },
  {
    id: 'cust-005',
    name: 'David Wilson',
    phone: '555-444-5555',
    email: 'dwilson@example.com',
    address: '654 Maple Dr, Anywhere, USA',
    notes: 'Prefers appointments in the morning',
    lastVisit: new Date(2023, 10, 10),
    preferredServices: ['1', '3'] // Haircut and Beard Trim
  },
  {
    id: 'cust-006',
    name: 'Jennifer Taylor',
    phone: '555-666-7777',
    email: 'jtaylor@example.com',
    address: '987 Cedar Ln, Someplace, USA',
    notes: 'Referred by Sarah Johnson',
    lastVisit: new Date(2024, 2, 1),
    preferredServices: ['2', '4'] // Hair Coloring and Full Treatment
  },
  {
    id: 'cust-007',
    name: 'Robert Martinez',
    phone: '555-888-9999',
    email: 'rmartinez@example.com',
    address: '159 Birch Blvd, Othertown, USA',
    notes: 'Monthly regular',
    lastVisit: new Date(2024, 1, 15),
    preferredServices: ['1'] // Haircut
  },
  {
    id: 'cust-008',
    name: 'Lisa Anderson',
    phone: '555-111-2222',
    email: 'lisa.a@example.com',
    address: '753 Spruce St, Anotherplace, USA',
    notes: 'Prefers female stylists',
    lastVisit: new Date(2023, 9, 25),
    preferredServices: ['2'] // Hair Coloring
  },
  {
    id: 'cust-009',
    name: 'James Thompson',
    phone: '555-333-4444',
    email: 'jthompson@example.com',
    address: '852 Walnut Ave, Thisplace, USA',
    notes: 'Always arrives 10 minutes early',
    lastVisit: new Date(2024, 0, 20),
    preferredServices: ['1', '3'] // Haircut and Beard Trim
  },
  {
    id: 'cust-010',
    name: 'Patricia Garcia',
    phone: '555-555-6666',
    email: 'pgarcia@example.com',
    address: '951 Aspen Rd, Thatplace, USA',
    notes: 'Prefers appointments on weekends',
    lastVisit: new Date(2023, 11, 30),
    preferredServices: ['4'] // Full Treatment
  }
];

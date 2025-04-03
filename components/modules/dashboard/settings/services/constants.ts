import { Service } from '@/components/modules/calendar/types';
import { PriceType } from '@/components/modules/onboarding/travel-fee/constants';

export const dummyServices: Service[] = [
  {
    id: 'service-1',
    name: 'Basic Haircut',
    serviceType: 'haircut',
    hours: '0',
    minutes: '30',
    price: '25.00',
    startsAt: false,
    priceType: PriceType.FIXED,
    duration: 30,
    description: 'A standard haircut service including wash and style.',
    color: '#4F46E5', // Indigo
    photos: [
      'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=768&q=80',
      'https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=768&q=80',
    ],
  },
  {
    id: 'service-2',
    name: 'Hair Coloring',
    serviceType: 'color',
    hours: '1',
    minutes: '30',
    price: '75.00',
    startsAt: false,
    priceType: PriceType.FIXED,
    duration: 90,
    description: 'Full hair coloring service with premium products.',
    color: '#EC4899', // Pink
    photos: [
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=768&q=80',
    ],
  },
  {
    id: 'service-3',
    name: 'Beard Trim',
    serviceType: 'grooming',
    hours: '0',
    minutes: '15',
    price: '15.00',
    startsAt: false,
    priceType: PriceType.FIXED,
    duration: 15,
    description: 'Professional beard trimming and shaping.',
    color: '#10B981', // Emerald
    photos: [
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=768&q=80',
    ],
  },
  {
    id: 'service-4',
    name: 'Full Styling',
    serviceType: 'styling',
    hours: '1',
    minutes: '0',
    price: '50.00',
    startsAt: false,
    priceType: PriceType.FIXED,
    duration: 60,
    description: 'Complete hair styling for special occasions.',
    color: '#F59E0B', // Amber
    photos: [
      'https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=768&q=80',
      'https://images.unsplash.com/photo-1560869713-7d0a29430803?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=768&q=80',
    ],
  },
  {
    id: 'service-5',
    name: 'Hair Treatment',
    serviceType: 'treatment',
    hours: '0',
    minutes: '45',
    price: '35.00',
    startsAt: false,
    priceType: PriceType.FIXED,
    duration: 45,
    description: 'Deep conditioning treatment for damaged hair.',
    color: '#6366F1', // Indigo
    photos: [
      'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=768&q=80',
    ],
  },
];

export const serviceCategories = [
  { value: 'haircut', label: 'Haircut' },
  { value: 'color', label: 'Color' },
  { value: 'styling', label: 'Styling' },
  { value: 'treatment', label: 'Treatment' },
  { value: 'grooming', label: 'Grooming' },
  { value: 'other', label: 'Other' },
];

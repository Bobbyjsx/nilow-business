import { BellIcon, CogIcon, CreditCardIcon, Globe, IdCard, ShieldCheckIcon, UserIcon } from 'lucide-react';

const settingsItems = [
  {
    title: 'Services Setup',
    keywords: ['services', 'business', 'setup'],
    description: 'Configure the services your business offers',
    key: 'business-services',
    icon: <CogIcon className='h-8 w-8 text-indigo-500' />,
    disabled: false,
  },
  {
    title: 'User Profile',
    keywords: ['profile', 'account', 'personal'],
    description: 'Manage your account details and preferences',
    key: 'user-profile',
    icon: <UserIcon className='h-8 w-8 text-blue-500' />,
    disabled: true,
  },
  {
    title: 'Security',
    keywords: ['security', 'password', 'authentication'],
    description: 'Configure security settings and authentication methods',
    key: 'security',
    icon: <ShieldCheckIcon className='h-8 w-8 text-green-500' />,
    disabled: true,
  },
  {
    title: 'Notifications',
    keywords: ['alerts', 'emails', 'notifications'],
    description: 'Manage your notification preferences',
    key: 'notifications',
    icon: <BellIcon className='h-8 w-8 text-yellow-500' />,
    disabled: true,
  },
  {
    title: 'Billing',
    keywords: ['payments', 'invoices', 'billing'],
    description: 'View and manage your billing information',
    key: 'billing',
    icon: <CreditCardIcon className='h-8 w-8 text-red-500' />,
    disabled: true,
  },
  {
    title: 'Integrations',
    keywords: ['apps', 'connections', 'integrations'],
    description: 'Connect with third-party services and tools',
    key: 'integrations',
    icon: <Globe className='h-8 w-8 text-purple-500' />,
    disabled: true,
  },
  {
    title: 'Team Members',
    keywords: ['team', 'users', 'access'],
    description: 'Manage your team and access permissions',
    key: 'team-members',
    icon: <IdCard className='h-8 w-8 text-orange-500' />,
    disabled: true,
  },
];

export { settingsItems };

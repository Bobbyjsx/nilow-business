'use client';
import { CalendarDays, ChevronDown, Cog, LogOut, Menu, Network, Settings, User, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

type SidebarItem = {
  label: string;
  icon?: React.ComponentType<any>;
  href?: string;
  type?: 'collapsible';
  items?: { label: string; href: string }[];
};

const sidebarItems: SidebarItem[] = [
  {
    label: 'Appointments',
    icon: CalendarDays,
    href: '/dashboard/appointments',
  },
  {
    label: 'Settings',
    icon: Cog,
    href: '/dashboard/settings',
  },
  {
    label: 'Services',
    icon: Network,
    href: '/dashboard/settings/business-services',
  },
  // {
  //   label: 'Projects',
  //   type: 'collapsible',
  //   items: [
  //     { label: 'Project Alpha', href: '/projects/alpha' },
  //     { label: 'Project Beta', href: '/projects/beta' },
  //     { label: 'Project Gamma', href: '/projects/gamma' },
  //   ],
  // },
  // {
  //   label: 'Reports',
  //   type: 'collapsible',
  //   items: [
  //     { label: 'Analytics', href: '/reports/analytics' },
  //     { label: 'Sales', href: '/reports/sales' },
  //     { label: 'Performance', href: '/reports/performance' },
  //   ],
  // },
];

export function Header() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleItemClick = (href: string) => {
    router.push(href || '');
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      // if (typeof window !== 'undefined') {
      //   localStorage.removeItem('userToken');
      //   document.cookie = 'authjs.csrf-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      //   document.cookie = 'authjs.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      // }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className='flex flex-col'>
      {/* Header */}
      <header className='sticky top-0 z-40 w-full border-b bg-gradient-to-tr from-business-dark via-business-slate to-business-dark shadow-sm'>
        <div className='flex h-16 items-center px-4'>
          <Button
            variant='ghost'
            size='icon'
            className='mr-2 text-[#F14F38] hover:bg-business-primary/30 hover:text-[#F14F38] bg-business-slate'
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
            <span className='sr-only'>Toggle menu</span>
          </Button>

          <div className='flex-1 flex justify-center'>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-8'>
                <Image
                  width={1000}
                  height={1000}
                  className='!rounded-none w-full h-full'
                  src='/favicon.png'
                  alt='User'
                />
              </div>
              <span className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F14F38] to-[#F9A23F]'>Nillow</span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='rounded-full h-8 w-8 border border-[#F9A23F]/30'
              >
                <Avatar className='h-8 w-8 '>
                  <AvatarImage
                    src='/placeholder.svg?height=32&width=32'
                    alt='User'
                  />
                  <AvatarFallback className='bg-orange-100 text-[#F14F38]'>{session?.user?.businessName?.charAt?.(0)?.toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className='mr-2 h-4 w-4' />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className='mr-2 h-4 w-4' />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className='mr-2 h-4 w-4' />
                <span onClick={handleLogout}>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className='relative'></div>
      </header>

      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar below header */}
      <div
        className={`w-full overflow-hidden transition-all duration-300 ease-in-out  absolute top-16 z-40 ${isOpen ? 'max-h-[500px] border-b shadow-md' : 'max-h-0'}`}
      >
        <nav className='bg-white p-4'>
          <div className='grid gap-2'>
            {sidebarItems.map((item, index) => {
              if (item.type === 'collapsible') {
                return (
                  <Collapsible
                    key={index}
                    className={index !== 0 ? 'mt-4' : ''}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant='ghost'
                        className='w-full justify-start font-semibold hover:bg-[#F14F38]/10 hover:text-[#F14F38]'
                      >
                        <span>{item.label}</span>
                        <ChevronDown className='ml-auto h-4 w-4' />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className='grid gap-1 pl-4 pt-2'>
                        {item?.items?.map((subItem, subIndex) => (
                          <Button
                            key={subIndex}
                            variant='ghost'
                            className={`justify-start hover:bg-[#F9A23F]/10 hover:text-[#F9A23F] ${
                              pathname === subItem.href ? 'bg-[#F9A23F]/10 text-[#F9A23F]' : ''
                            }`}
                            onClick={() => handleItemClick(subItem.href)}
                          >
                            {subItem.label}
                          </Button>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              }

              const Icon = item.icon;
              return (
                <Button
                  key={index}
                  variant='ghost'
                  className={`justify-start gap-2 hover:bg-[#F14F38]/10 hover:text-[#F14F38] ${
                    pathname === item.href ? 'bg-[#F14F38]/10 text-[#F14F38]' : ''
                  }`}
                  onClick={() => handleItemClick(item.href || '')}
                >
                  {Icon && <Icon className='h-4 w-4' />}
                  {item.label}
                </Button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import { ChevronDown, Home, LayoutDashboard, Menu, Settings, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';

export function VerticalSidebarAdvanced() {
  const [isOpen, setIsOpen] = React.useState(false);

  const mainNavItems = [
    { icon: Home, label: 'Home', href: '/dashboard' },
    // { icon: Users, label: 'Users', href: '/users' },
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: LayoutDashboard, label: 'Services', href: '/dashboard/settings/services' },
  ];

  const projectItems = [
    { label: 'Project Alpha', href: '/projects/alpha' },
    { label: 'Project Beta', href: '/projects/beta' },
    { label: 'Project Gamma', href: '/projects/gamma' },
  ];

  const reportItems = [
    { label: 'Analytics', href: '/reports/analytics' },
    { label: 'Sales', href: '/reports/sales' },
    { label: 'Performance', href: '/reports/performance' },
  ];

  return (
    <>
      <header className='sticky top-0 z-40 w-full border-b bg-background'>
        <div className='flex h-16 items-center px-4'>
          <div className='flex items-center gap-2'>
            <Sheet
              open={isOpen}
              onOpenChange={setIsOpen}
            >
              <SheetTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  className='mr-2'
                >
                  <Menu className='h-5 w-5' />
                  <span className='sr-only'>Toggle vertical menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side='top'
                className='w-full h-[70vh] overflow-y-auto'
              >
                <nav className='grid gap-2 py-4'>
                  <h2 className='mb-2 text-lg font-semibold tracking-tight'>Main Navigation</h2>
                  <div className='grid gap-1'>
                    {mainNavItems.map((item) => (
                      <Link
                        key={item.label}
                        // variant='ghost'
                        className='justify-start gap-2'
                        href={item.href}
                      >
                        <item.icon className='h-4 w-4' />
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  <Collapsible className='mt-6'>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant='ghost'
                        className='w-full justify-start font-semibold'
                      >
                        <span>Projects</span>
                        <ChevronDown className='ml-auto h-4 w-4' />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className='grid gap-1 pl-4 pt-2'>
                        {projectItems.map((item) => (
                          <Link
                            key={item.label}
                            // variant='ghost'
                            className='justify-start'
                            href={item.href}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Collapsible className='mt-2'>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant='ghost'
                        className='w-full justify-start font-semibold'
                      >
                        <span>Reports</span>
                        <ChevronDown className='ml-auto h-4 w-4' />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className='grid gap-1 pl-4 pt-2'>
                        {reportItems.map((item) => (
                          <Link
                            key={item.label}
                            // variant='ghost'
                            className='justify-start'
                            href={item.href}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </nav>
              </SheetContent>
            </Sheet>
            <span className='text-xl font-bold'>MyApp</span>
          </div>
          <div className='ml-auto flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
            >
              Sign In
            </Button>
            <Button size='sm'>Sign Up</Button>
          </div>
        </div>
      </header>
    </>
  );
}

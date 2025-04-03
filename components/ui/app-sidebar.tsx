import { motion } from 'framer-motion';
import { Home, Settings } from 'lucide-react';
import { useState } from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';

// Menu items with enhanced metadata
const items = [
  {
    title: 'Home',
    url: '/dashboard/appointments',
    icon: Home,
    color: 'text-emerald-500',
    hoverColor: 'group-hover:text-emerald-600',
    bgColor: 'group-hover:bg-emerald-50',
  },
  // {
  //   title: 'Inbox',
  //   url: '#',
  //   icon: Inbox,
  // },
  // {
  //   title: 'Calendar',
  //   url: '#',
  //   icon: Calendar,
  // },
  // {
  //   title: 'Search',
  //   url: '#',
  //   icon: Search,
  // },
  {
    title: 'Settings',
    url: '/dashboard/settings',
    icon: Settings,
    color: 'text-indigo-500',
    hoverColor: 'group-hover:text-indigo-600',
    bgColor: 'group-hover:bg-indigo-50',
  },
];

export function AppSidebar() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <Sidebar
      variant='sidebar'
      defaultValue={''}
      collapsible='icon'
      className='bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-sm'
    >
      <SidebarContent className='px-2-'>
        <SidebarGroup>
          <SidebarGroupLabel className='font-bold tracking-wider uppercase text-xs  mt-4 text-gray-500'>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Application
            </motion.span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className='space-y-2 py-4'>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className='overflow-hidden group'
                >
                  <TooltipProvider>
                    <Tooltip delayDuration={150}>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          asChild
                          onMouseEnter={() => setHoveredItem(item.title)}
                          onMouseLeave={() => setHoveredItem(null)}
                          className={`transition-all duration-200 ease-in-out rounded-lg ${item.bgColor}`}
                        >
                          <a
                            href={item.url}
                            className='flex items-center p-2 relative'
                          >
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className={`${item.color} ${item.hoverColor} transition-colors duration-200`}
                            >
                              <item.icon className='w-5 h-5' />
                            </motion.div>
                            <motion.span
                              className='ml-3 font-medium'
                              initial={{ x: -5, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ duration: 0.2, delay: 0.1 }}
                            >
                              {item.title}
                            </motion.span>
                            {hoveredItem === item.title && (
                              <motion.div
                                className='absolute -left-1 top-1/2 w-1 h-6 rounded-full bg-gradient-to-b from-purple-500 to-indigo-600'
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: -12 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                              />
                            )}
                          </a>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent
                        side='right'
                        sideOffset={20}
                        arrowPadding={10}
                        className='bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-2 rounded-md shadow-lg backdrop-blur-sm border border-gray-700/30'
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className='flex items-center space-x-2'
                        >
                          <item.icon className={`w-4 h-4 ${item.color}`} />
                          <span className='font-medium'>{item.title}</span>
                        </motion.div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

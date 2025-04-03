'use client';
import { AppSidebar } from '@/components/ui/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  return (
    <div className='h-full min-h-screen font-[family-name:var(--font-geist-sans)] w-full dark:bg-white dark:text-black'>
      <SidebarProvider open={false}>
        <aside className=''>
          <AppSidebar />
        </aside>
        <main className='py-5 w-full'>
          {isMobile && <SidebarTrigger />}
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;

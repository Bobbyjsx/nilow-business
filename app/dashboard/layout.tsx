import DashboardLayout from '@/layouts/DashboardLayout';
import { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

import DashboardLayout from '@/layouts/DashboardLayout';
import '../globals.css';

export default function DashboardRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

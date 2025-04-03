'use client';
import { Loader } from '@/components/ui/loader';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push('/dashboard/appointments');
  }, []);
  return (
    <div className='flex justify-center items-center h-screen'>
      <Loader text='Loading ...' />
    </div>
  );
}

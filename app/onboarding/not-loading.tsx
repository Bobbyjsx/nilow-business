'use client';
import { Loader } from '@/components/ui/loader';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function LoadingScreen() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      window.location.reload();
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className='flex items-center justify-center h-screen bg-gradient-to-b from-white to-gray-100'>
      <div className='w-full max-w-md px-8 flex flex-col items-center justify-center'>
        <motion.div
          className='relative flex justify-center mb-4'
          initial={{ scale: 0.8 }}
          animate={{ scale: 1, rotate: [0, 10, 0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Loader size={30} />
        </motion.div>
        <motion.div
          className='text-custom-black-500 text-lg font-semibold tracking-wide ml-4'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Loading{' '}
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            ...
          </motion.span>
        </motion.div>
        <motion.div
          className='mt-4 text-gray-400 text-sm'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          Please wait while we prepare your experience
        </motion.div>
      </div>
    </div>
  );
}

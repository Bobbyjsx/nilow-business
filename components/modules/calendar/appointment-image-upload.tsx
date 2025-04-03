'use client';

import { FadeIn } from '@/components/common/fade-in';
import { Loader } from '@/components/ui/loader';
import { motion } from 'framer-motion';
import { Camera, Upload, X } from 'lucide-react';
import { useState } from 'react';

interface AppointmentImageUploadProps {
  label?: string;
  imageUrl?: string;
  onUpload: (file: File) => Promise<void>;
  disabled?: boolean;
  className?: string;
}

export function AppointmentImageUpload({ label, imageUrl, onUpload, disabled = false, className = '' }: AppointmentImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    processFile(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const processFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      await onUpload(file);
    } catch (err) {
      setError('Failed to upload image');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && <p className='text-sm font-medium text-gray-700'>{label}</p>}

      {imageUrl ? (
        <div className='relative aspect-square w-full overflow-hidden rounded-lg shadow-sm bg-gradient-to-br from-gray-50 to-gray-100 group'>
          <img
            src={imageUrl}
            alt={label}
            className='h-full w-full object-cover transition-opacity'
          />
          {!disabled && (
            <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
              <label className='h-10 w-10 rounded-full bg-white/90 flex items-center justify-center cursor-pointer text-gray-800 hover:bg-white transition-colors'>
                <Camera className='h-5 w-5' />
                <input
                  type='file'
                  className='hidden'
                  accept='image/*'
                  onChange={handleFileChange}
                  disabled={isUploading || disabled}
                />
              </label>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`relative transition-all duration-300 ${
            isDragging ? 'bg-blue-50 border-blue-300 scale-[1.02]' : 'bg-gradient-to-br from-gray-50 to-gray-100'
          } border-2 ${isDragging ? 'border-blue-300' : 'border-gray-200'} border-dashed rounded-lg aspect-square w-full overflow-hidden shadow-sm`}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled && !isUploading) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={!disabled && !isUploading ? handleDrop : undefined}
        >
          {isUploading ? (
            <FadeIn className='text-center w-full h-full flex items-center justify-center flex-col gap-y-2 opacity-50'>
              <Loader />
              <div className=''>Uploading</div>
            </FadeIn>
          ) : (
            <>
              {!disabled ? (
                <label className='flex flex-col items-center justify-center w-full h-full cursor-pointer px-4 text-center'>
                  <div className='p-3 rounded-full bg-blue-50 mb-3'>
                    <Upload className='h-6 w-6 text-blue-500' />
                  </div>
                  <span className='text-sm font-medium text-gray-700'>Drag & drop your image here</span>
                  <span className='text-xs text-gray-500 mt-1'>or click to browse files</span>
                  <span className='text-xs text-gray-400 mt-3'>Maximum file size: 5MB</span>
                  <input
                    type='file'
                    className='hidden'
                    accept='image/*'
                    onChange={handleFileChange}
                    disabled={isUploading || disabled}
                  />
                </label>
              ) : (
                <div className='flex flex-col items-center justify-center h-full'>
                  <div className='p-3 rounded-full bg-gray-200 mb-3'>
                    <X className='h-6 w-6 text-gray-400' />
                  </div>
                  <span className='text-sm font-medium text-gray-500'>No image available</span>
                  <span className='text-xs text-gray-400 mt-1'>Upload disabled</span>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {error && (
        <motion.p
          className='text-xs text-red-500 mt-1 font-medium flex items-center'
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <X className='h-3 w-3 mr-1' />
          {error}
        </motion.p>
      )}
    </div>
  );
}

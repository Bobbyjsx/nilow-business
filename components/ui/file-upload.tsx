'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Trash2, Upload, X } from 'lucide-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

export interface ImageFile {
  file?: File | string;
}

export interface ImageUploadProps {
  label?: string;
  value?: ImageFile[];
  onChange: (files: ImageFile[]) => void;
  disabled?: boolean;
  className?: string;
  maxImages?: number;
  maxSizeInMB?: number;
  acceptedFileTypes?: string[];
  showPreview?: boolean;
  previewSize?: 'small' | 'medium' | 'large';
  error?: string;
}

export function ImageUpload({
  label,
  value = [],
  onChange,
  disabled = false,
  className = '',
  maxImages = 1,
  maxSizeInMB = 5,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  showPreview = true,
  previewSize = 'medium',
  error,
}: ImageUploadProps) {
  const previewSizeClass = {
    small: 'h-20 w-20',
    medium: 'h-32 w-32',
    large: 'h-48 w-48',
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (disabled || value.length + acceptedFiles.length > maxImages) {
        toast.error(`You can upload up to ${maxImages} images.`);
        return;
      }

      const validFiles = acceptedFiles.filter((file) => file.size <= maxSizeInMB * 1024 * 1024);
      if (validFiles.length < acceptedFiles.length) {
        toast.error(`Some files exceed the ${maxSizeInMB}MB limit.`);
      }

      const newFiles = validFiles.map((file) => ({ file: URL.createObjectURL(file) }));
      onChange([...value, ...newFiles]);
    },
    [disabled, value, maxImages, maxSizeInMB, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    disabled: disabled || value.length >= maxImages,
    maxFiles: maxImages - value.length,
  });

  const handleRemove = (index: number) => {
    const newImages = [...value];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {label && <p className='text-sm font-medium'>{label}</p>}
      {showPreview && value.length > 0 && (
        <div className='flex flex-wrap gap-3'>
          {value.map((image, index) => (
            <div
              key={index}
              className={cn('relative rounded-lg overflow-hidden shadow-sm bg-gray-100 group', previewSizeClass[previewSize])}
            >
              <img 
                src={typeof image.file === 'string' ? image.file : image.file ? URL.createObjectURL(image.file as File) : ''} 
                alt='Uploaded' 
                className='h-full w-full object-cover' 
              />
              {!disabled && (
                <Button
                  variant='destructive'
                  size='icon'
                  className='absolute top-1 right-1 h-6 w-6'
                  onClick={() => handleRemove(index)}
                  type='button'
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
      {value.length < maxImages && (
        <div
          {...getRootProps()}
          className={cn('border-2 border-dashed rounded-lg p-6 text-center cursor-pointer', isDragActive ? 'bg-primary/10 border-primary scale-105' : 'bg-gray-100 border-gray-200', disabled && 'opacity-60 cursor-not-allowed', error && 'border-red-500')}
        >
          <input {...getInputProps()} />
          <Upload className='h-6 w-6 text-primary mx-auto mb-2' />
          <p className='text-sm font-medium'>{isDragActive ? 'Drop your images here' : 'Drag & drop or click to upload'}</p>
          <p className='text-xs text-muted-foreground'>Max size: {maxSizeInMB}MB • Max {maxImages} image{maxImages > 1 ? 's' : ''}</p>
        </div>
      )}
      {error && <p className='text-xs text-red-500 flex items-center'><X className='h-3 w-3 mr-1' />{error}</p>}
    </div>
  );
}

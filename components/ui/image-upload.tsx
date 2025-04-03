'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Trash2, Upload, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

export type ImageFile = string | File;

export interface UploadedImage {
  file: File;
  preview: string;
  id: string;
}

export interface ImageUploadProps {
  label?: string;
  value: (ImageFile | UploadedImage)[];
  onChange: (files: (ImageFile | UploadedImage)[]) => void;
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
  const [isUploading, setIsUploading] = useState(false);

  const previewSizeClass = {
    small: 'h-20 w-20',
    medium: 'h-32 w-32',
    large: 'h-48 w-48',
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (disabled || isUploading) return;

      if (value.length + acceptedFiles.length > maxImages) {
        toast('Too many images', {
          description: `You can only upload up to ${maxImages} images.`,
          className: 'bg-red-500 text-white',
          dismissible: true,
        });
        return;
      }

      const oversizedFiles = acceptedFiles.filter((file) => file.size > maxSizeInMB * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        toast('File too large', {
          description: `Some files exceed the ${maxSizeInMB}MB limit.`,
          className: 'bg-red-500 text-white',
          dismissible: true,
        });
        return;
      }

      setIsUploading(true);

      try {
        const newFiles: UploadedImage[] = acceptedFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          id: `${file.name}-${Date.now()}`,
        }));

        onChange([...value, ...newFiles]);
      } catch (err) {
        console.error('Upload error:', err);
      } finally {
        setIsUploading(false);
      }
    },
    [disabled, isUploading, value, maxImages, maxSizeInMB, onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    disabled: disabled || isUploading || value.length >= maxImages,
    maxFiles: maxImages - value.length,
  });

  const handleRemove = (index: number) => {
    const newImages = [...value];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  const getImagePreview = (image: ImageFile | UploadedImage): string => {
    if (typeof image === 'string') {
      return image;
    } else if ('preview' in image) {
      return image.preview;
    } else {
      return URL.createObjectURL(image);
    }
  };

  const getImageId = (image: ImageFile | UploadedImage, index: number): string => {
    if (typeof image === 'string') {
      return `str-img-${index}`;
    } else if ('id' in image) {
      return image.id;
    } else {
      return `file-img-${index}`;
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      {label && <p className='text-sm font-medium text-gray-500'>{label}</p>}

      {showPreview && value.length > 0 && (
        <div className='flex flex-wrap gap-3'>
          {value.map((image, index) => (
            <div
              key={getImageId(image, index)}
              className={cn(
                'relative rounded-lg overflow-hidden shadow-sm bg-gradient-to-br from-gray-50 to-gray-100 group',
                previewSizeClass[previewSize],
              )}
            >
              <img
                src={getImagePreview(image)}
                alt='Uploaded'
                className='h-full w-full object-cover'
              />
              {!disabled && (
                <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center'>
                  <Button
                    variant='destructive'
                    size='icon'
                    className='h-8 w-8 rounded-full'
                    onClick={() => handleRemove(index)}
                    type='button'
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {value.length < maxImages && (
        <div
          {...getRootProps()}
          className={cn(
            'relative transition-all border-2 border-dashed rounded-lg shadow-sm- p-6 cursor-pointer',
            isDragActive ? 'bg-primary/10 border-primary scale-3d' : 'bg-gray-50 border-gray-300',
            disabled && 'opacity-60 cursor-not-allowed',
            error && 'border-destructive',
          )}
        >
          <input {...getInputProps()} />
          <div className='flex flex-col items-center justify-center text-center'>
            <div className='p-3 rounded-full bg-primary/10 mb-3'>
              <Upload className='h-6 w-6 text-primary' />
            </div>
            <span className='text-sm font-medium text-foreground'>{isDragActive ? 'Drop your images here' : 'Drag & drop your images here'}</span>
            <span className='text-xs text-muted-foreground mt-1'>or click to browse files</span>
            <span className='text-xs text-muted-foreground mt-3'>
              Max size: {maxSizeInMB}MB • Max {maxImages} image{maxImages > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className='text-xs text-destructive mt-1 font-medium flex items-center'>
          <X className='h-3 w-3 mr-1' />
          {error}
        </div>
      )}
    </div>
  );
}

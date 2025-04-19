import http from '@/lib/https';
import { useMutation } from '@tanstack/react-query';

type UploadImageResponse = {
  _id: string;
  image: string;
};

const uploadImage = async (images: File[]) => {
  const formData = new FormData();

  for (const image of images) {
    formData.append('images', image);
  }

  const response = await http.post<{ data: UploadImageResponse[] }>('/images/multiple', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const useUploadImage = () => {
  const {
    mutateAsync: executeImageUpload,
    isPending: isImageUploading,
    error,
  } = useMutation({
    mutationFn: uploadImage,
  });

  return {
    executeImageUpload,
    isImageUploading,
    error,
  };
};

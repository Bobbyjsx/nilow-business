import { ResponseWithPagination } from '@/lib/constants';
import http from '@/lib/https';
import { useMutation, useQuery } from '@tanstack/react-query';

type BusinessCategory = {
  _id: string;
  category_name: string;
  description: string;
  image: string;
  parent_id: string;
  createdBy: string;
  updatedBy: string;
};

type CreateBusinessCategory = {
  name: string;
};

const getBusinessCategories = async () => {
  const res = await http.get<ResponseWithPagination<BusinessCategory[]>>('/business-category');
  return res.data;
};

const createBusinessCategory = async (data: CreateBusinessCategory) => {
  const res = await http.post<CreateBusinessCategory & { _id: string }>('/business-category', data);
  return res.data;
};

export const useBusinessBusinessCategories = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['business-categories'],
    queryFn: getBusinessCategories,
  });

  return { categories: data?.data || [], pagination: data?.meta, isLoading, error };
};

export const useCreateBusinessCategory = () => {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: createBusinessCategory,
  });

  return { createBusinessCategory: mutateAsync, isPending, error };
};

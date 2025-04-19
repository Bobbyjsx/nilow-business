import { PriceType } from '@/components/modules/onboarding/travel-fee/constants';
import http from '@/lib/https';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type ServiceType = {
  _id: string;
  name: string;
};

export type BusinessService = {
  _id: string;
  name: string;
  description: string;
  service_type: ServiceType;
  duration: string;
  service_color: string;
  cost: number;
  cost_type: PriceType;
  service_images: { _id: string; image: string }[];
  service_target: string;
  service_category: ServiceType;
  business: any;
  status: number;
  duration_hours: number;
  duration_minutes: number;
};

import { z } from 'zod';

export const BusinessServiceSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  service_type: z.object({
    _id: z.string(),
    name: z.string(),
  }),
  service_color: z.string(),
  cost: z.number(),
  cost_type: z.nativeEnum(PriceType),
  service_images: z.array(z.any()),
  service_target: z.string(),
  service_category: z.object({
    _id: z.string(),
    name: z.string(),
  }),
  business: z.any(),
  status: z.number(),
  duration_hours: z.number().optional(),
  duration_minutes: z.number().optional(),
});

export type CreateBusinessService = {
  name: string;
  description: string;
  service_type: string;
  service_color: string;
  cost: number;
  cost_type: PriceType;
  service_images: string[];
  service_target: string;
  service_category: ServiceType;
  duration_hour: string;
  duration_minutes: string;
};

const getServiceTypes = async () => {
  const response = await http.get<{ data: ServiceType[] }>('/services-type');
  return response;
};

const createServiceType = async (serviceType: any) => {
  const response = await http.post<ServiceType[]>('/services-type/create', serviceType);
  return response;
};

const getBusinessServices = async ({ page = 1, limit = 10, search = '', searchBy = 'name' }) => {
  const res = await http.get<{ data: BusinessService[] }>('/services', { params: { page, limit, searchBy, search } });
  return res;
};

const getSingleBusinessService = async (id: string) => {
  const res = await http.get<{ data: BusinessService }>('/services/' + id);
  return res;
};

const executeCreateBusinessService = async (serviceType: CreateBusinessService) => {
  const response = await http.post<ServiceType[]>('/services', serviceType);
  return response;
};

const executeUpdateBusinessService = async ({ id, serviceType }: { id: string; serviceType: CreateBusinessService }) => {
  const response = await http.post<ServiceType[]>('/services/update/' + id, serviceType);
  return response;
};

export const useServiceTypes = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['serviceTypes'],
    queryFn: getServiceTypes,
  });

  return { data: data?.data?.data || [], isLoading, error };
};

export const useCreateServiceType = () => {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: createServiceType,
  });

  return { createServiceType: mutateAsync, isPending, error };
};

export const useGetBusinessServices = (page = 1, limit = 10) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['business-services', page, limit],
    queryFn: () => getBusinessServices({ page, limit }),
  });

  return { data: data?.data?.data || [], isLoading, error };
};

export const useGetSingleBusinessService = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['single-business-service', id],
    queryFn: () => getSingleBusinessService(id),
  });

  return { data: data?.data?.data || null, isLoading, error };
};

export const useCreateBusinessService = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: executeCreateBusinessService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-services', 'single-business-service', 'business-services-infinite'] });
    },
  });

  return { createBusinessService: mutateAsync, isPending, error };
};

export const useUpdateBusinessService = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: executeUpdateBusinessService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-services', 'single-business-service', 'business-services-infinite'] });
    },
  });

  return { updateBusinessService: mutateAsync, isPending, error };
};

export const fetchBusinessServicesInfiniteQuery = (page = 1, limit = 10, search = '') => {
  const { data, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
    queryKey: ['business-services-infinite', page, limit, search],
    queryFn: ({ pageParam = 1 }) => getBusinessServices({ page: pageParam, limit, search }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage?.data?.data?.length) return undefined;
      return allPages.length + 1;
    },
  });

  const services = data?.pages?.flatMap((page) => page.data.data) || [];
  return { services, isLoading: isLoading, isFetchingNextPage, error, hasNextPage, fetchNextPage, refetch };
};

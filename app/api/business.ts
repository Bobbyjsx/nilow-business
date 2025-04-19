import http from '@/lib/https';
import { useMutation, useQuery } from '@tanstack/react-query';

export type BusinessShort = {
  _id: string;
  business_name: string;
  location: string;
  business_categories: string[];
  business_logo: string;
  status: number;
};

export type BusinessLocation = {
  street_address: string;
  city: string;
  state: string;
  postal_code: number;
  country: string;
  longitude: string;
  latitude: string;
};

export type User = {
  email: string;
  username: string;
  phone_number: string;
  roles: string;
  last_login: string;
  last_activity_at: string;
  _id: any;
};

export type BusinessWallet = {
  _id: string;
  balance: number;
};

export type BusinessLong = {
  _id: string;
  business_name: string;
  location: BusinessLocation;
  business_categories: string[];
  business_fee: number;
  team_size: string;
  business_hours: string;
  services: string[];
  business_logo: string;
  wallet: BusinessWallet;
  deleted_at?: string;
  created_by?: User;
  updated_by?: User;
  status: number;
};

export type BusinessDetails = {
  when_to_live: number;
  business_name?: string;
  business_category: string;
  business_fee_type: string;
  business_fee: string;
  max_travel_distance: string;
  business_fee_policy: string;
  team_size: string;
  business_hours: string[];
  breaks: string[];
};

export type BusinessServiceDetails = {
  name: string;
  description: string;
  duration_hour: string;
  duration_minutes: string;
  cost: number;
  cost_type: string;
  service_images: string[];
  service_color: string;
  service_target: string;
  service_category: string;
  service_type: string;
};

export type UserDetails = {
  username?: string;
  phone_number?: string;
  device_token?: string;
};

export type ProfileDetails = {
  first_name: string;
  last_name: string;
};

export type UpdateBusinessPayload = {
  business: Partial<BusinessDetails>;
  location: BusinessLocation;
  services: Partial<BusinessServiceDetails>[];
  user: UserDetails;
  profile: ProfileDetails;
  is_complete: boolean;
};

const getBusiness = async () => {
  const res = await http.get<BusinessShort>('/business/businesses');
  return res;
};

const createBusiness = async (data: Partial<UpdateBusinessPayload>) => {
  const res = await http.post('/business/update', data);
  return res;
};

export const useGetBusiness = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['get-businesses'],
    queryFn: getBusiness,
  });

  return { data, isLoading, error };
};

export const useUpdateBusiness = () => {
  const {
    mutate: executeUpdateBusiness,
    isPending: isBusinessUpdateExecuting,
    error,
  } = useMutation({
    mutationFn: createBusiness,
  });

  return { executeUpdateBusiness, isBusinessUpdateExecuting, error };
};

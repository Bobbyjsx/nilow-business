import { BusinessHoursFormValues } from '@/components/modules/onboarding/business-hours/constant';
import http from '@/lib/https';
import { useQuery } from '@tanstack/react-query';

export enum UserStatus {
  ACTIVE = 1,
  DISABLED = 2,
  NEW = 3,
}

type ActiveBusinessResponse = {
  data: {
    user: {
      _id: string;
      email: string;
      username: string;
      phone_number: string;
      roles: string;
      status: number;
    };
    business: {
      _id: string;
      business_fee_type: string;
      when_to_live: number;
      deleted_at: string | null;
      created_by: string;
      updated_by: string;
      status: number;
      wallet: {
        _id: string;
        balance: number;
      };
      createdAt: string;
      updatedAt: string;
      __v: number;
      business_name: string;
      business_slug: string;
      business_category: {
        _id: string;
        category_name: string;
      };
      business_fee_policy: string;
      max_travel_distance: string;
      team_size: string;
      business_hours: BusinessHoursFormValues;
    };
    profile: {
      _id: string;
      role: number;
    };
  };
  meta: any;
  response: {
    message: string;
  };
  status: boolean;
  statusType: string;
};

const getActiveBusiness = async () => {
  const res = await http.get<ActiveBusinessResponse>('/business/me');
  return res?.data;
};

export const useActiveBusiness = () => {
  const {
    data: activeBusiness,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['get-active-business'],
    queryFn: getActiveBusiness,
  });
  return { activeBusiness: activeBusiness?.data, isLoading, error };
};

import http from '@/lib/https';
import { useMutation, useQuery } from '@tanstack/react-query';

export type SendTokenAuthResponse = {
  email?: string;
  phoneNumber?: string;
};

export type VerifyOtp = {
  email?: string;
  phoneNumber?: string;
  otp: string;
};

const getVerificationToken = async (payload: SendTokenAuthResponse) => {
  const response = await http.post('/auth/send_token_auth', payload);
  return response.data;
};

export const verifyToken = async (payload: VerifyOtp) => {
  const response = await http.post('/auth/validate_token_auth', payload);
  return response.data;
};

export const useSendOtp = () => {
  const {
    mutateAsync: executeSendOtp,
    isPending: isSendOtpExecuting,
    error,
  } = useMutation({
    mutationFn: getVerificationToken,
  });
  return { executeSendOtp, isSendOtpExecuting, error };
};

export const useVerifyOtp = () => {
  const {
    mutateAsync: executeVerifyOtp,
    isPending: isVerifyOtpExecuting,
    error,
  } = useMutation({
    mutationFn: verifyToken,
  });
  return { executeVerifyOtp, isVerifyOtpExecuting, error };
};

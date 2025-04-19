import { BASE_API_URL } from '@/lib/constants';
import { getServerError } from '@/lib/https';
import type { DefaultSession } from 'next-auth';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { VerifyOtp } from './api/auth';
import { authConfig } from './auth.config';

type AuthUser = {
  id: string;
  email: string;
  username?: string;
  phoneNumber?: string;
  status?: number;
  businessName?: string;
  businessId?: string;
  isCompleted?: boolean;
  accessToken: string;
};

export const verifyToken = async (payload: VerifyOtp) => {
  const response = await fetch(`${BASE_API_URL}/auth/validate_token_auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-client-role': 'Business',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch((e) => {
    console.log('Authhed error:', JSON.stringify(data));
    return {};
  });

  // console.log('Authhed Data:', JSON.stringify(data));
  if (!response.ok) {
    // console.error('Token verification failed:', JSON.stringify(data));
    const message = data?.response?.message || 'Failed to verify token';
    throw new Error(message);
  }

  return data;
};

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const { email, password } = credentials ?? {};

          if (!email || !password) {
            throw new Error('Email and OTP are required');
          }

          const response = await verifyToken({ email: email as string, otp: password as string });

          const user = response?.data?.user;
          const business = response?.data?.business;

          if (!user || !response.data.access_token) {
            throw new Error('Invalid response from server');
          }

          return {
            accessToken: response.data.access_token,
            id: user._id,
            email: user.email,
            username: user.username,
            phoneNumber: user.phone_number,
            status: user.status,
            businessName: business?.business_name,
            businessId: business?._id,
            isCompleted: user.is_completed || false,
          };
        } catch (error) {
          const errMsg = getServerError(error);
          throw new Error(errMsg || 'Authorization failed');
        }
      },
    }),
  ],
});

declare module 'next-auth' {
  interface Session {
    user: AuthUser & DefaultSession['user'];
  }

  interface User extends AuthUser {}
}

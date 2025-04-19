'use server';

import { signIn } from '@/app/auth';
import { AuthError } from 'next-auth';

export async function authenticate(prevState: any, formData: FormData) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { status: 400, message: 'Invalid credentials.' };
        default:
          return { status: 500, message: error?.cause?.err?.message };
      }
    }

    throw error;
  }
}

//@ts-ignore
import { isRedirectError } from 'next/dist/client/components/redirect';

export const signInUser = async (signInValues: { email: string; password: string }) => {
  try {
    await signIn('credentials', signInValues);
  } catch (error) {
    // https://github.com/nextauthjs/next-auth/discussions/9389
    if (isRedirectError(error)) {
      throw error;
    }

    throw new Error('Email or password incorrect');
  }
};

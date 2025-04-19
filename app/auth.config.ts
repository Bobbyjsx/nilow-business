import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';
import { UserStatus } from './api/me';

export const authConfig = {
  pages: {
    signIn: '/onboarding/auth',
  },

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isCompleted = auth?.user?.isCompleted || auth?.user.status === UserStatus.ACTIVE;

      // console.log('IS auth completed', isCompleted, auth?.user);
      const isAuthPage = nextUrl.pathname.startsWith('/onboarding/auth');
      const isDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnboardingSetup = nextUrl.pathname.startsWith('/onboarding');

      // 1. Unauthenticated user trying to access dashboard
      if (!isLoggedIn && isDashboard) {
        return NextResponse.redirect(new URL('/onboarding/auth', nextUrl));
      }

      //2. Unauthenticated and on onboarding page
      if (!isLoggedIn && isOnboardingSetup && !isAuthPage) {
        return NextResponse.redirect(new URL('/onboarding/auth', nextUrl));
      }

      // 3. Logged-in but not completed onboarding
      if (isLoggedIn && !isCompleted && !isOnboardingSetup) {
        return NextResponse.redirect(new URL('/onboarding/business-setup', nextUrl));
      }

      // 4. Logged-in and not completed onboarding accessing auth page
      if (isLoggedIn && !isCompleted && isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', nextUrl));
      }

      // 5. Logged-in and completed onboarding accessing auth/onboarding page
      if (isLoggedIn && isCompleted && isOnboardingSetup) {
        return NextResponse.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update') {
        return {
          ...token,
          user: {
            ...(token.user as Record<string, any>),
            ...(session.user.isCompleted !== undefined && { isCompleted: session.user.isCompleted }),
            ...(session.user.status !== undefined && { status: session.user.status }),
            ...(session.user.businessId !== undefined && { businessId: session.user.businessId }),
            ...(session.user.businessName !== undefined && { businessName: session.user.businessName }),
          },
        };
      }

      if (user) {
        token.user = user;
      }
      return { ...token };
    },

    async session({ session, token }) {
      const { user } = token;
      // @ts-ignore
      session.user = { ...session.user, ...user };

      return session;
    },
  },

  providers: [],
} satisfies NextAuthConfig;

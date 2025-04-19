'use client';
import { useUpdateBusiness } from '@/app/api/business';
import { MultiPartForm, MultiPartFormPage } from '@/components/common/MultiPartForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Progress_Step } from '../constants';
import AboutYou from './AboutYou';
import { BusinessSetupFormSchema, BusinessSetupFormValues, BusinessSetupPageKeys } from './constants';
import PickCategory from './PickCategory';
import WhereDoYouWork from './WhereDoYouWork';

interface FormValues {
  category: string;
  businessName: string;
  yourName: string;
  phoneNumber: string;
}

interface SessionData {
  user?: {
    category?: string;
    businessName?: string;
    username?: string;
    phoneNumber?: string;
  };
}

interface Payload {
  business?: {
    business_name?: string;
    business_category?: string;
  };
  user?: {
    username?: string;
    phone_number?: string;
    device_token?: string;
  };
}

function createPayload(values: FormValues, sessionData: SessionData | null): Payload {
  const payload: Payload = {
    business: {},
    user: {},
  };

  const sessionUser = sessionData?.user;

  // Add businessName if it has changed or doesn't exist in session
  if (values.businessName && values.businessName !== sessionUser?.businessName) {
    payload.business!.business_name = values.businessName;
  }

  // Add category if it has changed or doesn't exist in session
  if (values.category && values.category !== sessionUser?.category) {
    payload.business!.business_category = values.category;
  }

  // Add username if it has changed or doesn't exist in session
  if (values.yourName && values.yourName !== sessionUser?.username) {
    payload.user!.username = values.yourName;
  }

  // Add phoneNumber if it has changed or doesn't exist in session
  if (values.phoneNumber && values.phoneNumber !== sessionUser?.phoneNumber) {
    payload.user!.phone_number = values.phoneNumber;
    payload.user!.device_token = '';
  }

  // Only include user if it has any data
  if (payload.user && Object.keys(payload.user).length === 0) {
    delete payload.user;
  }

  // Only include business if it has any data
  if (payload.business && Object.keys(payload.business).length === 0) {
    delete payload.business;
  }

  return payload;
}

export const BusinessSetupForms = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<BusinessSetupPageKeys>(BusinessSetupPageKeys.CATEGORY);
  const { executeUpdateBusiness } = useUpdateBusiness();
  const { data: sessionData, update: updateSession } = useSession();

  const methods = useForm<BusinessSetupFormValues>({
    resolver: zodResolver(BusinessSetupFormSchema),
    defaultValues: {
      physicalStore: false,
      homeService: false,
    },
  });

  useEffect(() => {
    if (!sessionData?.user) return;
    if (sessionData.user.businessName && methods.getValues('businessName') === sessionData.user.businessName) {
      methods.setValue('businessName', sessionData.user.businessName);
    }
    if (sessionData.user.phoneNumber && methods.getValues('phoneNumber') === sessionData.user.phoneNumber) {
      methods.setValue('phoneNumber', sessionData.user.phoneNumber);
    }
    if (sessionData.user.username && methods.getValues('yourName') === sessionData.user.username) {
      methods.setValue('yourName', sessionData.user.username);
    }
  }, [sessionData?.user]);

  const handleNextPage = () => {
    const currentIndex = multiPartPages.findIndex((page) => page.key === currentPage);
    const nextPage = multiPartPages[currentIndex + 1]?.key;

    if (nextPage) {
      setCurrentPage(nextPage);
    } else {
      router.push('/onboarding/auth');
    }
  };

  const handleNoPrevPage = () => {
    signOut();
    router.push('/onboarding/auth');
  };
  const handleBusinessSetupUpload = () => {
    const values = methods.getValues();

    const payload = createPayload(values, sessionData);
    console.log('payload', payload);

    try {
      updateSession({
        ...sessionData,
        user: {
          ...(sessionData && sessionData.user && { ...sessionData.user }),
          businessName: values.businessName,
        },
      });
      executeUpdateBusiness(payload);
      handleNextPage();
    } catch (error) {
      console.error('Error uploading business setup:', error);
    }
  };

  const multiPartPages: MultiPartFormPage<BusinessSetupPageKeys>[] = [
    {
      key: BusinessSetupPageKeys.CATEGORY,
      progress: Progress_Step.STEP_ONE,
      pageNode: <PickCategory onFormSubmit={handleNextPage} />,
    },
    {
      key: BusinessSetupPageKeys.CONTACT,
      progress: Progress_Step.STEP_TWO,
      pageNode: <AboutYou onFormSubmit={handleNextPage} />,
    },
    {
      key: BusinessSetupPageKeys.PAYMENT,
      progress: Progress_Step.STEP_THREE,
      pageNode: <WhereDoYouWork onFormSubmit={handleBusinessSetupUpload} />,
    },
  ];

  return (
    <FormProvider {...methods}>
      <MultiPartForm<BusinessSetupPageKeys>
        pages={multiPartPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onLastPage={handleNoPrevPage}
      />
    </FormProvider>
  );
};

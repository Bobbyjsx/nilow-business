'use client';
import { MultiPartForm, MultiPartFormPage } from '@/components/common/MultiPartForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Progress_Step } from '../constants';
import AboutYou from './AboutYou';
import { BusinessSetupFormSchema, BusinessSetupFormValues, BusinessSetupPageKeys } from './constants';
import PickCategory from './PickCategory';
import WhereDoYouWork from './WhereDoYouWork';

export const BusinessSetupForms = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<BusinessSetupPageKeys>(BusinessSetupPageKeys.CATEGORY);

  const methods = useForm<BusinessSetupFormValues>({
    resolver: zodResolver(BusinessSetupFormSchema),
    defaultValues: {
      physicalStore: false,
      homeService: false,
    },
  });

  const handleNextPage = () => {
    const currentIndex = multiPartPages.findIndex((page) => page.key === currentPage);
    const nextPage = multiPartPages[currentIndex + 1]?.key;

    if (nextPage) {
      setCurrentPage(nextPage);
    } else {
      router.push('/onboarding/auth');
    }
  };

  const handleFormCompletion = () => {
    router.push('/onboarding/auth');
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
      pageNode: <WhereDoYouWork onFormSubmit={handleNextPage} />,
    },
  ];

  return (
    <FormProvider {...methods}>
      <MultiPartForm<BusinessSetupPageKeys>
        pages={multiPartPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onLastPage={handleFormCompletion}
      />
    </FormProvider>
  );
};

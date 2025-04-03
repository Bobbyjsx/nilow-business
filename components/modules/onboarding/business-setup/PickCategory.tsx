import { Separator } from '@/components/ui/separator';
import { ChevronRight } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { BusinessSetupFormValues } from './constants';

type Props = {
  onFormSubmit: () => void;
};

export default function PickCategory({ onFormSubmit }: Props) {
  const { setValue } = useFormContext<BusinessSetupFormValues>();

  const handleCategorySelection = (category: string) => {
    setValue('category', category);
    onFormSubmit?.();
  };

  return (
    <main className='flex flex-col justify-center items-center'>
      <h1 className='text-2xl font-bold text-custom-black-700'>What's your business? </h1>
      <p className='text-custom-black-300 text-sm mt-4 mb-7'>Choose a category that best describes your business.</p>

      <section className='grid grid-cols-3 w-full gap-10 place-items-center'>
        {[1, 2, 3, 4, 5, 6].map((category) => (
          <button
            key={category}
            className='flex flex-col justify-center items-center'
            onClick={() => handleCategorySelection('Nail Salon')}
          >
            <div className='bg-gray-400 rounded-full h-18 w-18' />
            <p className='text-custom-black-600 text-base font-semibold'>Nail Salon</p>
          </button>
        ))}
      </section>

      <section className='w-full flex justify-start mt-16 items-start flex-col'>
        <p className='text-custom-black-300 text-sm mb-1'>Other categories</p>

        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((category) => (
          <div
            key={category}
            className='w-full'
          >
            <button
              className='w-full flex justify-between items-center cursor-pointer py-4'
              onClick={() => handleCategorySelection('Pet Station')}
            >
              <p className='text-custom-black-500 text-base font-medium'>Pet station</p>
              <ChevronRight
                className='text-custom-black-300 font-light'
                size={20}
              />
            </button>

            <Separator />
          </div>
        ))}
      </section>
    </main>
  );
}

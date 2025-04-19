import { UpdateBusinessPayload } from '@/app/api/business';
import { useBusinessBusinessCategories } from '@/app/api/category';
import { Loader } from '@/components/ui/loader';
import { Separator } from '@/components/ui/separator';
import { ChevronRight } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { BusinessSetupFormValues } from './constants';

type Props = {
  onFormSubmit: (data: Partial<UpdateBusinessPayload>) => void;
};

export default function PickCategory({ onFormSubmit }: Props) {
  const { categories, isLoading } = useBusinessBusinessCategories();
  const { setValue } = useFormContext<BusinessSetupFormValues>();

  const handleCategorySelection = (category: string) => {
    setValue('category', category);
    onFormSubmit?.({
      business: { business_category: category },
    });
  };

  const mainCategories = categories.slice(0, 6);
  const otherCategories = categories.slice(6);

  return (
    <main className='flex flex-col justify-center items-center'>
      <h1 className='text-2xl font-bold text-custom-black-700'>What's your business?</h1>
      <p className='text-custom-black-300 text-sm mt-4 mb-7'>Choose a category that best describes your business.</p>

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <section className='grid grid-cols-3 w-full gap-10 place-items-center'>
            {mainCategories.map((category) => (
              <button
                key={category._id}
                className='flex flex-col justify-center items-center'
                onClick={() => handleCategorySelection(category._id)}
              >
                <div className='bg-gray-400 rounded-full h-18 w-18' />
                <p className='text-custom-black-600 text-base font-semibold line-clamp-2 w-[80%]'>{category.category_name}</p>
              </button>
            ))}
          </section>

          {otherCategories.length > 0 && (
            <section className='w-full flex justify-start mt-16 items-start flex-col'>
              <p className='text-custom-black-300 text-sm mb-1'>Other categories</p>

              {otherCategories.map((category) => (
                <div
                  key={category._id}
                  className='w-full'
                >
                  <button
                    className='w-full flex justify-between items-center cursor-pointer py-4'
                    onClick={() => handleCategorySelection(category._id)}
                  >
                    <p className='text-custom-black-500 text-base font-medium'>{category.category_name}</p>
                    <ChevronRight
                      className='text-custom-black-300 font-light'
                      size={20}
                    />
                  </button>
                  <Separator />
                </div>
              ))}
            </section>
          )}
        </>
      )}
    </main>
  );
}

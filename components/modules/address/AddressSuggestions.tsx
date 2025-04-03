import { Separator } from '@/components/ui/separator';
import { AddressDetails } from '@/hooks/useAddress';
import { UserAddress } from '@/lib/utils';
import { ChevronRight, Navigation } from 'lucide-react';

type AddressSuggestionsProps = {
  suggestions: AddressDetails[];
  onSelect: (address: Partial<UserAddress>) => void;
};

export const AddressSuggestions = ({ suggestions, onSelect }: AddressSuggestionsProps) => {
  if (!suggestions.length) return null;

  return (
    <section className='mt-1'>
      {suggestions.map(({ description, place_id, ...rest }, index) => (
        <div key={place_id}>
          <button
            className='w-full flex justify-between items-center cursor-pointer py-4'
            onClick={() => onSelect({ city: rest.city, street: rest.street, zipCode: rest.zipCode })}
          >
            <div className='flex gap-x-5 items-center justify-center pr-3'>
              <Navigation className='size-6 text-custom-black-200 font-light stroke-1' />
              <p className='text-custom-black-500 text-sm font-normal truncate max-w-82'>{description}</p>
            </div>
            <ChevronRight className='text-custom-black-300 font-light size-5 stroke-1' />
          </button>
          {index !== suggestions.length - 1 && <Separator className='my-1' />}
        </div>
      ))}
    </section>
  );
};

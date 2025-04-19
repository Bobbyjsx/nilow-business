import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { SearchInput } from '@/components/ui/search-input';
import { Separator } from '@/components/ui/separator';
import { useAddressSuggestions } from '@/hooks/useAddress';
import { loadGoogleMaps, reverseGeocode, UserAddress } from '@/lib/utils';
import { AlertTriangle, ChevronRight, MapPin, Navigation, Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { StoreLocationFormValues } from '../onboarding/location/constants';
import { AddressSuggestions } from './AddressSuggestions';
import { MapView } from './MapView';

type Props = {
  onSelectAddress: () => void;
};

export const SelectAddress = ({ onSelectAddress }: Props) => {
  const { setValue } = useFormContext<StoreLocationFormValues>();
  const [location, setLocation] = useState<google.maps.LatLng | null>(null);
  const [address, setAddress] = useState<UserAddress | undefined>();
  const [searchValue, setSearchValue] = useState('');
  const { suggestions, loading } = useAddressSuggestions({ q: searchValue });
  console.log('Suggestions:', address);
  useEffect(() => {
    const loadMaps = async () => {
      try {
        await loadGoogleMaps({ onload: setLocation, setAddress });
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };
    loadMaps();
  }, []);

  const handleSelectAddress = (data?: Partial<UserAddress>) => {
    const selectedAddress = data || address;
    if (!selectedAddress) return;

    setValue('city', selectedAddress.city || '');
    setValue('street', selectedAddress.street || '');
    setValue('zipCode', selectedAddress.zipCode || '');
    setValue('state', selectedAddress.state || '');
    setValue('country', selectedAddress.country || '');
    setValue('latitude', selectedAddress.latitude || '');
    setValue('longitude', selectedAddress.longitude || '');
    onSelectAddress();
  };

  const onLocationChange = (data?: google.maps.LatLng) => {
    if (!data) return;
    reverseGeocode(data, setAddress);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const AddressNotFound = () => (
    <div className='w-full flex flex-col items-center justify-center py-8 px-4 bg-gray-50 rounded-lg border border-gray-100 my-4'>
      <div className='bg-amber-100 p-4 rounded-full mb-4'>
        <AlertTriangle className='size-8 text-amber-500 stroke-[1.5]' />
      </div>
      <h3 className='text-lg font-medium text-custom-black-700 mb-2'>Address Not Found</h3>
      <p className='text-custom-black-400 text-sm text-center mb-6 max-w-md'>
        We couldn&apos;t find any matches for &quot;{searchValue}&quot;. Try checking your spelling or use a more specific address.
      </p>
      <div className='flex flex-col gap-3 w-full max-w-xs'>
        <Button
          variant='outline'
          className='w-full flex items-center justify-center gap-2'
          onClick={() => setSearchValue('')}
        >
          <Search className='size-4' /> Try another search
        </Button>
        <Button
          variant='secondary'
          className='w-full flex items-center justify-center gap-2'
          onClick={onSelectAddress}
        >
          <MapPin className='size-4' /> Enter address manually
        </Button>
      </div>
    </div>
  );

  return (
    <div className='flex flex-col justify-between items-center w-full h-full min-h-[60vh]'>
      <section className='w-full flex flex-col justify-between items-center gap-y-8'>
        <h1 className='text-2xl font-bold text-custom-black-700'>Enter Your Address</h1>
        <p className='text-custom-black-300 text-sm mb-7'>Where can clients find you?</p>

        <form className='w-full'>
          <SearchInput
            value={searchValue}
            onChange={handleSearchChange as any}
          />
        </form>

        {loading ? (
          <Loader />
        ) : (
          <section className='w-full'>
            {address?.street && !searchValue && (
              <div className='w-full'>
                <button
                  className='w-full flex justify-between items-center cursor-pointer py-4'
                  onClick={() => handleSelectAddress()}
                >
                  <div className='flex gap-x-4 items-center justify-center'>
                    <Navigation className='size-6 text-custom-black-200 font-light stroke-1' />
                    <div className='flex flex-col items-start gap-y-1'>
                      <p className='text-custom-black-500 text-sm font-normal'>{address.street}</p>
                      <p className='text-custom-black-300 text-xs'>{address.city}</p>
                    </div>
                  </div>
                  <ChevronRight className='text-custom-black-300 font-light size-5 stroke-1' />
                </button>
                <Separator />
              </div>
            )}

            {suggestions.length > 0 && (
              <AddressSuggestions
                suggestions={suggestions}
                onSelect={handleSelectAddress}
              />
            )}

            {searchValue && suggestions.length === 0 && !loading && <AddressNotFound />}
          </section>
        )}

        {(!searchValue || location) && (
          <MapView
            location={location}
            onLocationChange={onLocationChange}
          />
        )}
      </section>

      <section className='flex justify-between items-center w-full mt-10'>
        <p className='text-custom-black-300 text-sm'>Can&apos;t find your address?</p>
        <Button
          variant='outline'
          onClick={onSelectAddress}
          className='text-custom-black-900'
          rightNode={<Plus className='size-5 text-custom-black-600 font-light stroke-1' />}
        >
          Add location
        </Button>
      </section>
    </div>
  );
};

import { SearchInput } from '@/components/ui/search-input';
import { useAddressSuggestions } from '@/hooks/useAddress';
import { loadGoogleMaps } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { AddressSuggestions } from './AddressSuggestions';
import { MapView } from './MapView';

export const AddressSearch = () => {
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch] = useDebounce(searchValue, 300);
  const [location, setLocation] = useState<google.maps.LatLng | null>(null);

  const { suggestions } = useAddressSuggestions({ q: debouncedSearch });

  useEffect(() => {
    const loadMaps = async () => {
      await loadGoogleMaps({ onload: setLocation });
    };
    loadMaps();
  }, []);

  return (
    <div className='relative'>
      {/* <StreetAddressInput value={searchValue} onChange={setSearchValue} /> */}
      <SearchInput
        value={searchValue}
        onChange={setSearchValue}
      />
      {suggestions && (
        <AddressSuggestions
          suggestions={suggestions}
          onSelect={() => {}}
        />
      )}
      {!searchValue && <MapView location={location} />}
    </div>
  );
};

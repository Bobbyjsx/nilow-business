import { UserAddress } from '@/lib/utils';
import { useEffect, useState } from 'react';

export type AddressDetails = {
  description: string;
  place_id: string;
} & Partial<UserAddress>;

export const useAddressSuggestions = ({ q = '' }: { q?: string }) => {
  const [suggestions, setSuggestions] = useState<AddressDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSuggestions([]);
    setError(null);

    if (!q || typeof google === 'undefined') return;

    setLoading(true);

    const autocompleteService = new google.maps.places.AutocompleteService();
    const placesService = new google.maps.places.PlacesService(document.createElement('div'));

    autocompleteService.getPlacePredictions(
      {
        input: q,
        componentRestrictions: { country: 'ng' },
      },
      async (predictions, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
          setError('Failed to fetch address suggestions');
          setLoading(false);
          return;
        }

        try {
          const detailedSuggestions = await Promise.all(
            predictions.map(async (prediction) => {
              return new Promise<AddressDetails>((resolve) => {
                placesService.getDetails({ placeId: prediction.place_id }, (place, status) => {
                  if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                    const addressComponents = place.address_components || [];
                    const zipCode = getAddressComponent(addressComponents, 'postal_code');
                    const city = getAddressComponent(addressComponents, 'administrative_area_level_1');
                    const country = getAddressComponent(addressComponents, 'country');
                    const street = getAddressComponent(addressComponents, 'route') || getAddressComponent(addressComponents, 'long_name');

                    resolve({
                      description: prediction.description,
                      place_id: prediction.place_id,
                      zipCode,
                      city,
                      street,
                      country: 'ng',
                    });
                  } else {
                    resolve({
                      description: prediction.description,
                      place_id: prediction.place_id,
                      country: 'ng',
                    });
                  }
                });
              });
            }),
          );

          setSuggestions(detailedSuggestions);
        } catch (err) {
          setError('Error processing address suggestions');
        } finally {
          setLoading(false);
        }
      },
    );
  }, [q]);

  return { suggestions, loading, error };
};

const getAddressComponent = (components: google.maps.GeocoderAddressComponent[], type: string) => {
  const component = components.find((c) => c.types.includes(type));
  return component ? component.long_name : undefined;
};

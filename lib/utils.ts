import { Loader } from '@googlemaps/js-api-loader';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GOOGLE_MAPS_API_KEY } from './constants';

export type UserAddress = { street: string; zipCode: string; city: string; country: string; state: string; longitude: string; latitude: string };
export type SetUserAddress = (address: UserAddress) => void;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const loadGoogleMaps = async ({ onload, setAddress }: { onload: (position: google.maps.LatLng) => void; setAddress?: SetUserAddress }) => {
  try {
    const loader = new Loader({ apiKey: GOOGLE_MAPS_API_KEY, libraries: ['places'] });
    await loader.load();
    if (navigator.geolocation) {
      navigator.geolocation?.getCurrentPosition(
        ({ coords }) => {
          const position = new google.maps.LatLng(coords.latitude, coords.longitude);
          onload(position);
          if (setAddress) {
            reverseGeocode(position, setAddress);
          }
        },
        (error) => console.error('Geolocation Error:', error),
        { enableHighAccuracy: true },
      );
    }
  } catch (error) {
    console.error('Loader Error:', error);
  }
};

export const reverseGeocode = (latLng: google.maps.LatLng, setAddress: SetUserAddress) => {
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ location: latLng }, (results, status) => {
    if (status === google.maps.GeocoderStatus.OK && results[0]) {
      let street = '';
      let zipCode = '';
      let city = '';
      let country = '';
      let state = '';

      results[0].address_components.forEach((component) => {
        const types = component.types;

        if (types.includes('street_number') || types.includes('route')) {
          street = street ? `${street} ${component.long_name}` : component.long_name;
        }

        if (types.includes('postal_code')) {
          zipCode = component.long_name;
        }

        if (types.includes('administrative_area_level_1')) {
          city = component.long_name;
        }

        if (types.includes('country')) {
          country = component.long_name;
        }

        if (types.includes('administrative_area_level_2')) {
          state = component.long_name;
        }
      });

      setAddress({
        street,
        zipCode,
        city,
        country,
        state,
        latitude: latLng.lat().toString(),
        longitude: latLng.lng().toString(),
      });
    } else {
      console.error('Geocoder failed due to:', status);
    }
  });
};

export const capitalizeFirstLetter = (str: string) => {
  return str?.charAt(0)?.toUpperCase() + str?.slice(1);
};

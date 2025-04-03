import { FloatingLabelInput } from '@/components/ui/floating-label-input';
import { useCallback, useEffect, useRef, useState } from 'react';

type StateSelectProps = {
  onChange: (state: { name: string; code: string } | null) => void;
  error?: string;
  value?: string;
  label?: string;
  isRequired?: boolean;
  disabled?: boolean;
};

export const StateSelect = ({ error, onChange, value, label, isRequired, disabled }: StateSelectProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autoCompleteRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const [states, setStates] = useState<{ name: string; code: string }[]>([]);
  const [inputValue, setInputValue] = useState(value || '');

  // Memoized fetch function to avoid recreating on every render
  const fetchStates = useCallback((query: string) => {
    if (!autoCompleteRef.current || !query.trim()) {
      setStates([]);
      return;
    }

    autoCompleteRef.current.getPlacePredictions(
      {
        input: query,
        types: ['(regions)'],
        componentRestrictions: { country: 'NG' },
      },
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          const stateList = predictions.map((p) => {
            // Extract only the state name by removing the country part
            const stateName = p.description.split(',')[0].trim();
            return {
              name: stateName,
              code: p.place_id,
            };
          });
          setStates(stateList);
        } else {
          setStates([]);
        }
      },
    );
  }, []);

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      fetchStates(newValue);
    },
    [fetchStates],
  );

  // Initialize Google Places service
  useEffect(() => {
    if (!window.google) {
      console.warn('Google Maps API not loaded');
      return;
    }

    autoCompleteRef.current = new google.maps.places.AutocompleteService();

    // Set initial value if provided
    if (value && inputRef.current) {
      inputRef.current.value = value;
      setInputValue(value);
    }
  }, [value]);

  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      // No manual cleanup needed as we're using React's event system
    };
  }, []);

  return (
    <div className='relative'>
      <FloatingLabelInput
        className='placeholder:text-gray-900'
        disabled={disabled}
        error={error}
        isRequired={isRequired}
        label={label}
        placeholder='Search for a state in Nigeria...'
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
      />

      {states.length > 0 && (
        <ul className='mt-2 bg-white border rounded-md shadow-md max-h-48 overflow-auto z-20 absolute w-full'>
          {states.map((state) => (
            <li
              key={state.code}
              className='p-2 cursor-pointer hover:bg-gray-100'
              onClick={() => {
                onChange(state);
                setInputValue(state.name);
                setStates([]);
              }}
            >
              {state.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

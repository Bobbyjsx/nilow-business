import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { StoreLocationSchema } from '../onboarding/location/constants';
import ConfirmAddress from './ConfirmAddress';
import { SelectAddress } from './SelectAddress';

type AddressViewKeys = 'address' | 'confirm-address';

export const AddressPage = ({ onNextPage }: { onNextPage: () => void }) => {
  const [view, setView] = useState<AddressViewKeys>('address');
  const methods = useForm({
    resolver: zodResolver(StoreLocationSchema),
  });

  const handleSelectAddress = () => {
    setView('confirm-address');
  };
  return (
    <div>
      <FormProvider {...methods}>
        {view === 'address' ? (
          <div>
            <SelectAddress onSelectAddress={handleSelectAddress} />
          </div>
        ) : (
          <div>
            <ConfirmAddress
              onReset={() => {
                setView('address');
                methods.reset();
              }}
              onFormSubmit={onNextPage}
            />
          </div>
        )}
      </FormProvider>
    </div>
  );
};

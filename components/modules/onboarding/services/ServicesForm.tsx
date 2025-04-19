import { useServiceTypes } from '@/app/api/services';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FloatingLabelInput } from '@/components/ui/floating-label-input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Controller, useFormContext } from 'react-hook-form';
import { Service, hoursOptions, minutesOptions } from './constants';

type ServiceFormProps = {
  onSubmit: (data: Service) => void;
  onCancel: () => void;
  isEditing: boolean;
  isSubmitting?: boolean;
};

export const ServiceForm = ({ onSubmit, onCancel, isEditing, isSubmitting = false }: ServiceFormProps) => {
  const { data: serviceTypes, isLoading: serviceTypesLoading } = useServiceTypes();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useFormContext<Service>();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-4'
    >
      <Controller
        name='name'
        control={control}
        render={({ field }) => (
          <FloatingLabelInput
            label='Service Name'
            placeholder='e.g. Haircut'
            error={errors.name?.message}
            isRequired
            {...field}
          />
        )}
      />

      <Controller
        name='serviceType'
        control={control}
        render={({ field }) => (
          <Select
            variant='searchable'
            options={serviceTypes?.map((type) => ({ value: type._id, label: type.name })) || []}
            label='Service Type'
            placeholder={serviceTypesLoading ? 'Loading...' : 'Select Service Type'}
            className='w-full'
            disabled={serviceTypesLoading}
            error={errors.serviceType?.message}
            fallbackOption={{
              value: 'unassigned',
              label: 'Unassigned',
            }}
            {...field}
          />
        )}
      />

      <div className='flex gap-4'>
        <Controller
          name='hours'
          control={control}
          render={({ field }) => (
            <Select
              options={hoursOptions}
              label='Hours'
              placeholder='Hours'
              className='w-full'
              error={errors.hours?.message}
              {...field}
            />
          )}
        />

        <Controller
          name='minutes'
          control={control}
          render={({ field }) => (
            <Select
              options={minutesOptions}
              label='Minutes'
              placeholder='Minutes'
              className='w-full'
              error={errors.minutes?.message}
              {...field}
            />
          )}
        />
      </div>

      <div className='flex items-end gap-4'>
        <Controller
          name='price'
          control={control}
          render={({ field }) => (
            <FloatingLabelInput
              label='Price'
              placeholder='e.g. 25.00'
              leftNode={<p className='px-3'>$</p>}
              error={errors.price?.message}
              isRequired
              className='flex-1'
              type='number'
              {...field}
            />
          )}
        />

        <div className='flex items-center gap-2 mb-2 h-10 justify-center '>
          <Controller
            name='startsAt'
            control={control}
            render={({ field }) => (
              <Checkbox
                id='startsAt'
                className='w-4 h-4 size-6'
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label
            htmlFor='startsAt'
            className='text-sm text-gray-700 cursor-pointer'
          >
            Starts at
          </Label>
        </div>
      </div>

      <div className='flex justify-end gap-x-3 pt-4'>
        <Button
          type='button'
          variant='outline'
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {isEditing ? 'Update' : 'Add'} Service
        </Button>
      </div>
    </form>
  );
};

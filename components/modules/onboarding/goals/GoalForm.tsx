import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const goalSchema = z.object({
  goals: z.array(z.string())
    .min(1, { message: 'Please select at least one goal' })
    .max(5, { message: 'You can select up to 5 goals' })
});

type GoalFormValues = z.infer<typeof goalSchema>;

export const GoalForm = ({ onFormSubmit }: { onFormSubmit: () => void }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      goals: []
    }
  });

  const goals = [
    { value: 'more_self_booked_clients', label: 'More self-booked clients' },
    { value: 'improve_financial_performance', label: 'Improve financial performance' },
    { value: 'less_canceled', label: 'Less canceled or missed appointments' },
    { value: 'engage_clients', label: 'Engage clients' },
    { value: 'attract_new_clients', label: 'Attract New Clients' },
    { value: 'simplified_payment_processing', label: 'Simplified payment processing' },
    { value: 'selling_products', label: 'Selling products' },
    { value: 'tracking_business_statistics', label: 'Tracking business statistics' },
    { value: 'social_media_integration', label: 'Social media integration' },
    { value: 'other', label: 'Other' },
  ];

  const MAX_SELECTIONS = 5;

  const onSubmit: SubmitHandler<GoalFormValues> = (data) => {
    console.log(data);
    onFormSubmit();
  };

  return (
    <main className='w-full '>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-y-6 w-full'
      >
        <section className='text-center'>
          <h1 className='text-xl sm:text-2xl font-bold text-custom-black-700'>How do you hope we can help you?</h1>
          <div className='text-sm text-muted-foreground mt-2'>Choose up to {MAX_SELECTIONS}</div>
        </section>

        <Controller
          name='goals'
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <>
              <ToggleGroup
                type='multiple'
                value={field.value}
                onValueChange={(value) => {
                  if (value.length <= MAX_SELECTIONS) {
                    field.onChange(value);
                  }
                }}
                className='flex gap-2 sm:gap-4 w-full !p-0'
              >
                {goals.map((goal) => (
                  <ToggleGroupItem
                    key={goal.value}
                    value={goal.value}
                    aria-label={'toggle ' + goal.label}
                    size={'lg'}
                    variant={'outline'}
                    className='text-center- p-2'
                    disabled={field.value.length >= MAX_SELECTIONS && !field.value.includes(goal.value)}
                  >
                    {goal.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              {errors.goals && (
                <p className="text-sm text-red-500 mt-1">{errors.goals.message}</p>
              )}
            </>
          )}
        />

        <Button
          type='submit'
          className='w-full mt-4'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Continue'}
        </Button>
      </form>
    </main>
  );
};

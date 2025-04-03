'use client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type StaffFormProps = {
  onNextPage: () => void;
};

enum StaffNumberEnum {
  NONE = 'none',
  TWO_TO_THREE = '2-3',
  FOUR_TO_FIVE = '4-5',
  SIX_PLUS = '6+',
}

const staffFormSchema = z.object({
  staffCount: z.nativeEnum(StaffNumberEnum, {
    required_error: 'Please select a team size',
  }),
});

type StaffFormState = z.infer<typeof staffFormSchema>;

const StaffForm = ({ onNextPage }: StaffFormProps) => {
  const form = useForm<StaffFormState>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      staffCount: undefined,
    },
  });

  const {
    formState: { isSubmitting, isValid },
  } = form;

  const onSubmit = (data: StaffFormState) => {
    console.log(data);
    onNextPage();
  };

  return (
    <div className='flex flex-col justify-start items-center w-full h-full min-h-[60vh] gap-6'>
      <h1 className='text-2xl font-bold text-custom-black-700 mt-6 mb-5'>What's your team size?</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full max-w-md space-y-8'
        >
          <FormField
            control={form.control}
            name='staffCount'
            render={({ field }) => (
              <FormItem className='space-y-4'>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className='flex flex-col space-y-3'
                  >
                    <FormItem className='flex items-center space-x-3 space-y-0'>
                      <FormControl>
                        <RadioGroupItem
                          className='size-5'
                          value={StaffNumberEnum.NONE}
                        />
                      </FormControl>
                      <FormLabel className='font-normal text-base'>Just me</FormLabel>
                    </FormItem>
                    <FormItem className='flex items-center space-x-3 space-y-0'>
                      <FormControl>
                        <RadioGroupItem
                          className='size-5'
                          value={StaffNumberEnum.TWO_TO_THREE}
                        />
                      </FormControl>
                      <FormLabel className='font-normal text-base'>2-3 staff members</FormLabel>
                    </FormItem>
                    <FormItem className='flex items-center space-x-3 space-y-0'>
                      <FormControl>
                        <RadioGroupItem
                          className='size-5'
                          value={StaffNumberEnum.FOUR_TO_FIVE}
                        />
                      </FormControl>
                      <FormLabel className='font-normal text-base'>4-5 staff members</FormLabel>
                    </FormItem>
                    <FormItem className='flex items-center space-x-3 space-y-0'>
                      <FormControl>
                        <RadioGroupItem
                          className='size-5'
                          value={StaffNumberEnum.SIX_PLUS}
                        />
                      </FormControl>
                      <FormLabel className='font-normal text-base'>6 or more staff members</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage className='text-red-500' />
              </FormItem>
            )}
          />
          <Button
            type='submit'
            disabled={isSubmitting || !isValid}
            className='w-full py-6 text-lg font-medium'
          >
            Continue
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default StaffForm;

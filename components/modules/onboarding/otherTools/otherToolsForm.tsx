'use client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type ToolsFormProps = {
  onNextPage: () => void;
};

enum ToolsEnum {
  YES = 'yes',
  NO = 'no',
}

const toolsFormSchema = z.object({
  usedSimilarTools: z.nativeEnum(ToolsEnum, {
    required_error: 'Please select an option',
  }),
});

type ToolsFormState = z.infer<typeof toolsFormSchema>;

const ToolsForm = ({ onNextPage }: ToolsFormProps) => {
  const form = useForm<ToolsFormState>({
    resolver: zodResolver(toolsFormSchema),
    defaultValues: {
      usedSimilarTools: undefined,
    },
  });

  const {
    formState: { isSubmitting, isValid },
  } = form;

  const onSubmit = (data: ToolsFormState) => {
    console.log(data);
    onNextPage();
  };

  return (
    <div className='flex flex-col justify-start items-center w-full h-full min-h-[60vh]- gap-6'>
      <h1 className='text-2xl font-bold text-custom-black-700 mt-6 mb-5 text-center'>
        Have you previously used other tools to support your business?
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full max-w-md space-y-8'
        >
          <FormField
            control={form.control}
            name='usedSimilarTools'
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
                          value={ToolsEnum.NO}
                        />
                      </FormControl>
                      <FormLabel className='font-normal text-base'> No, I haven't</FormLabel>
                    </FormItem>
                    <FormItem className='flex items-center space-x-3 space-y-0'>
                      <FormControl>
                        <RadioGroupItem
                          className='size-5'
                          value={ToolsEnum.YES}
                        />
                      </FormControl>
                      <FormLabel className='font-normal text-base'>Yes, I have</FormLabel>
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

export default ToolsForm;

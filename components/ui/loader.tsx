import { Loader as LoaderIcon } from 'lucide-react';

export const Loader = ({ text, size }: { text?: string; size?: number }) => {
  return (
    <div className='loader w-full flex justify-center items-center flex-col gap-y-3'>
      <LoaderIcon
        className='animate-spin'
        size={size ?? 20}
      />
      {text && <span className='loader-text ml-4'>{text}</span>}
    </div>
  );
};

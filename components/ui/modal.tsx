import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { X } from 'lucide-react';
import { Fragment } from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  modalContainerClassName?: string;
  disableBackdropClickToClose?: boolean;
  showCancelButton?: boolean;
};

export const Modal = ({ isOpen, onClose, children, modalContainerClassName, disableBackdropClickToClose, showCancelButton = true }: ModalProps) => {
  const handleBackdropClick = () => {
    if (disableBackdropClickToClose) return;
    onClose();
  };

  return (
    <Transition.Root
      as={Fragment}
      show={isOpen}
    >
      <Dialog
        as='div'
        className='relative z-50'
        onClose={handleBackdropClick}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-white/30 bg-opacity-75 backdrop-blur-sm transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-50 overflow-y-auto'>
          <div className='flex h-screen items-center justify-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel
                className={clsx('transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 shadow-xl transition-all', modalContainerClassName)}
              >
                {showCancelButton && (
                  <div className='absolute right-0 top-0 z-50 pr-4 pt-4 sm:block'>
                    <button
                      className='rounded-lg bg-white text-gray-400 hover:text-gray-500 focus:outline-none'
                      onClick={onClose}
                      type='button'
                    >
                      <span className='sr-only'>Close</span>
                      <X
                        aria-hidden='true'
                        className='h-6 w-6'
                      />
                    </button>
                  </div>
                )}
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

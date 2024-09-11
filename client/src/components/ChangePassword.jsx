import React from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import Button from './Button';
import Loading from './Loading';
import ModalWrapper from './ModalWrapper';
import Textbox from './Textbox';
import { useChangePasswordMutation } from '../redux/slices/api/userApiSlice';
import { toast } from 'sonner';

const ChangePassword = ({ open, setOpen }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const handleOnSubmit = async (data) => {
    if (data.password !== data.cpass) {
      toast.error('Passwords do not match');
    }
    try {
      await changePassword(data).unwrap();
      setTimeout(() => {
        setOpen(false);
      }, 1500);
      toast.success('Password changed successfully');
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <Dialog.Title
            as='h2'
            className='text-base font-bold leading-6 text-gray-900 mb-4'
          >
            Change Password
          </Dialog.Title>
          <div className='mt-2 flex flex-col gap-6'>
            <Textbox
              placeholder='Enter new password'
              type='password'
              name='password'
              label='New Password'
              className='w-full rounded'
              register={register('password', {
                required: 'Password is required',
              })}
              error={errors.password ? errors.password.message : ''}
            />
            <Textbox
              placeholder='Confirm new password'
              type='password'
              name='cpass'
              label='Confirm Password'
              className='w-full rounded'
              register={register('cpass', {
                required: 'Confirm password is required',
              })}
              error={errors.cpass ? errors.cpass.message : ''}
            />
          </div>
          {isLoading ? (
            <div className='py-5'>
              <Loading />
            </div>
          ) : (
            <div className='py-3 mt-4 sm:flex sm:flex-row-reverse'>
              <Button
                type='submit'
                className='bg-cyan-600 px-8 text-sm font-semibold text-white hover:bg-cyan-700'
                label='Save'
              />
              <button
                type='button'
                className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </ModalWrapper>
    </>
  );
};

export default ChangePassword;

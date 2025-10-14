import React from 'react';
import ChangePasswordForm from '../../../../section/ChangePassword';
import CustomerMainLayout from '@/components/CustomerLayout/CustomerMainLayout';

export default function CustomerChangePasswordPage() {
  return (
    <CustomerMainLayout>
        <ChangePasswordForm />
    </CustomerMainLayout>
  );
}
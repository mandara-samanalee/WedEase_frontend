import React from 'react';
import ChangePasswordForm from '@/section/changePassword';
import CustomerMainLayout from '@/components/CustomerLayout/CustomerMainLayout';

export default function CustomerChangePasswordPage() {
  return (
    <CustomerMainLayout>
        <ChangePasswordForm />
    </CustomerMainLayout>
  );
}
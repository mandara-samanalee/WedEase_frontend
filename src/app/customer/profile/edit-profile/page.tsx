import CustomerMainLayout from '@/components/CustomerLayout/CustomerMainLayout';
import EditCustomerProfile from '@/section/CustomerEditprofile';
import React from 'react';

export default function EditProfilePage() {
    return (
        <CustomerMainLayout>
            <EditCustomerProfile />
        </CustomerMainLayout>
    );
}
    
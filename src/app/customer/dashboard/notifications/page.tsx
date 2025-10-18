import React from "react";
import CustomerMainLayout from "@/components/CustomerLayout/CustomerMainLayout";
import NotificationsCenter from "@/components/NotificationCenter/NotificationsCenter";

export default function ViewNotifications() {
    return (
        <CustomerMainLayout>
            <NotificationsCenter />
        </CustomerMainLayout>
    )
}
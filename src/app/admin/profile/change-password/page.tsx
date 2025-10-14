import AdminMainLayout from "@/components/AdminLayout/AdminMainLayout";
import ChangePasswordForm from "@/utils/changePassword";

export default function PasswordChangePage() {
    return (
        <AdminMainLayout>
            <ChangePasswordForm />
        </AdminMainLayout>
    );
}
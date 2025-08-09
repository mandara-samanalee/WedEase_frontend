// utils/validatePasswords.ts
export const validatePasswords = (newPassword: string, confirmPassword: string) => {
    const errors: { password?: string; confirm?: string } = {};

    // At least 8 chars, one uppercase letter, one number, one special character
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
        errors.password =
            'Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character';
    }

    if (newPassword !== confirmPassword) {
        errors.confirm = 'Passwords do not match';
    }

    return errors;
};

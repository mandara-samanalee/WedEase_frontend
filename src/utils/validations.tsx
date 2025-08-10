// utils/validatePasswords.ts
export const validatePasswords = (newPassword: string, confirmPassword: string) => {
    const errors: { password?: string; confirm?: string } = {};

    // At least 8 chars, one uppercase letter, one number, one special character
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
        errors.password =
            'Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character';
    }

    if (newPassword !== confirmPassword) {
        errors.confirm = 'New password and confirm password do not match.';
    }

    return errors;
};

// Generic email validator (allows any domain)
export const validateEmail = (email: string): string | undefined => {
  if (!email?.trim()) return "Email is required";
  const base = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!base.test(email)) return "Enter a valid email address";
  return undefined;
};

// Phone validator for Sri Lanka and generic formats
// Sri Lanka: +94 followed by 9 digits
// Generic: 7–15 digits after country code (or total digits if no code)
export const validatePhone = (
    phone: string,
    opts?: { countryCode?: string }
): string | undefined => {
    if (!phone?.trim()) return "Phone number is required";

    // Keep only "+" and digits
    const cleaned = phone.replace(/[^\d+]/g, "");
    // All digits without "+"
    const digitsOnly = cleaned.replace(/\D/g, "");

    // Normalize country code if provided
    const code = opts?.countryCode
        ? (opts.countryCode.startsWith("+") ? opts.countryCode : `+${opts.countryCode}`)
        : undefined;

    // Calculate local digits (digits after country code)
    let localDigits = digitsOnly;
    if (code && cleaned.startsWith(code)) {
        const codeDigits = code.replace("+", "");
        localDigits = digitsOnly.slice(codeDigits.length);
    } else if (cleaned.startsWith("+")) {
        // If no country code passed, just strip 1 to 3 digits as code
        const possibleCodeLen = Math.min(3, Math.max(1, digitsOnly.length - 1));
        localDigits = digitsOnly.slice(possibleCodeLen);
    }

    // +94 rule: exactly 9 digits after +94
    if (cleaned.startsWith("+94")) {
        if (localDigits.length !== 9) {
            return "Sri Lanka numbers must be +94 followed by exactly 9 digits";
        }
        return undefined;
    }

    // Generic rule: 7–15 digits after the country code (or total digits if none provided)
    if (localDigits.length < 7 || localDigits.length > 15) {
        return "Phone must be 7–15 digits (excluding country code)";
    }

    return undefined;
};

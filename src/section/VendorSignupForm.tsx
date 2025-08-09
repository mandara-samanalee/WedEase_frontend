"use client"

import React, { useState } from 'react';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import GradientButton from "@/components/GradientButton";
import toast from "react-hot-toast";
import { validateEmail, validatePhone, validatePasswords } from "@/utils/validations";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function VendorSignupForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    contactNo: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // phone pieces
  const [prefix, setPrefix] = useState('+94');
  const [number, setNumber] = useState('');

  // errors
  const [emailError, setEmailError] = useState<string | undefined>();
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [pwErrors, setPwErrors] = useState<{ password?: string; confirm?: string }>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // validate email 
    const eErr = validateEmail(formData.email);
    setEmailError(eErr);

    // validate phone (+94 => 9 digits after; others 7–15)
    const combinedPhone = `${prefix}${number}`;
    const pErr = validatePhone(combinedPhone, { countryCode: prefix });
    setPhoneError(pErr);

    // validate password strength + match
    const pws = validatePasswords(formData.password, formData.confirmPassword);
    setPwErrors(pws);

    const firstError =
      eErr || pErr || pws.password || pws.confirm;

    if (firstError) {
      toast.error(firstError);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/vendor/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          contactNo: combinedPhone.replace(/\s/g, ''),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to register vendor");

      toast.success("Account created successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        city: "",
        contactNo: "",
        password: "",
        confirmPassword: "",
      });
      setNumber("");
      setPrefix("+94");
      setEmailError(undefined);
      setPhoneError(undefined);
      setPwErrors({});
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during registration");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-l p-8 border-2 border-purple-300 w-[600]">
        <form className="space-y-2" onSubmit={handleSubmit}>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-purple-700 font-semibold mb-1">First Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>

            <div className="flex-1">
              <label className="block text-purple-700 font-semibold mb-1">Last Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-purple-700 font-semibold mb-1">Address</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-purple-700 font-semibold mb-1">City/Region</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-purple-700 font-semibold mb-1">Email</label>
            <input
              type="email"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none
                ${emailError ? "border-red-500 focus:ring-2 focus:ring-red-400" : "border-purple-300 focus:ring-2 focus:ring-purple-400"}`}
              required
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (emailError) setEmailError(undefined);
              }}
              aria-invalid={!!emailError}
            />
            {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
          </div>

          <div>
            <label className="block text-purple-700 font-semibold mb-1">Mobile Number</label>
            <div className="flex space-x-2">
              <input
                type="text"
                className={`w-20 px-2 py-2 border rounded-lg focus:outline-none
                  ${phoneError ? "border-red-500 focus:ring-2 focus:ring-red-400" : "border-purple-300 focus:ring-2 focus:ring-purple-400"}`}
                placeholder="+94"
                maxLength={5}
                required
                value={prefix}
                onChange={(e) => {
                  // allow '+' then 1–4 digits
                  const cleaned = e.target.value.replace(/[^\d+]/g, "");
                  const withPlus = cleaned.startsWith("+") ? cleaned : `+${cleaned.replace(/\+/g, "")}`;
                  const next = withPlus.slice(0, 5);
                  setPrefix(next);
                  if (phoneError) setPhoneError(undefined);
                }}
                inputMode="numeric"
                pattern="\+\d{1,4}"
                aria-invalid={!!phoneError}
              />
              <input
                type="tel"
                className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none
                  ${phoneError ? "border-red-500 focus:ring-2 focus:ring-red-400" : "border-purple-300 focus:ring-2 focus:ring-purple-400"}`}
                required
                value={number}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "");
                  setNumber(digits.slice(0, 15));
                  if (phoneError) setPhoneError(undefined);
                }}
                placeholder={prefix === "+94" ? "7XXXXXXXX (9 digits)" : "Phone number (7–15 digits)"}
                inputMode="numeric"
                aria-invalid={!!phoneError}
              />
            </div>
            {phoneError && <p className="mt-1 text-sm text-red-600">{phoneError}</p>}
          </div>

          <div>
            <label className="block text-purple-700 font-semibold mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none
                  ${pwErrors.password ? "border-red-500 focus:ring-2 focus:ring-red-400" : "border-purple-300 focus:ring-2 focus:ring-purple-400"}`}
                required
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (pwErrors.password) setPwErrors((s) => ({ ...s, password: undefined }));
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-purple-500"
                tabIndex={-1}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </button>
            </div>
            {pwErrors.password && <p className="mt-1 text-sm text-red-600">{pwErrors.password}</p>}
          </div>

          <div>
            <label className="block text-purple-700 font-semibold mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none
                  ${pwErrors.confirm ? "border-red-500 focus:ring-2 focus:ring-red-400" : "border-purple-300 focus:ring-2 focus:ring-purple-400"}`}
                required
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                  if (pwErrors.confirm) setPwErrors((s) => ({ ...s, confirm: undefined }));
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-purple-500"
                tabIndex={-1}
              >
                {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
              </button>
            </div>
            {pwErrors.confirm && <p className="mt-1 text-sm text-red-600">{pwErrors.confirm}</p>}
          </div>

          <div className="pt-4">
            <GradientButton btnLabel="Signup as a Vendor" className="w-full" />
          </div>
        </form>

        <div className="text-center mt-4">
          <p>
            Already have an account?{" "}
            <a href="/login" className="text-purple-600 hover:font-bold">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import FormInput from "@/components/FormInput";
import ErrorAlert from "@/components/ErrorAlert";
import SuccessAlert from "@/components/SuccessAlert";
import { updatePassword } from "@/services/user.service";
import { getErrorMessage } from "@/utils/api";
import { isValidPassword, MIN_PASSWORD_LENGTH } from "@/utils/validators";

export default function ChangePasswordPage() {
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");

    const validationErrors = {};
    if (!form.password) validationErrors.password = "New password is required";
    else if (!isValidPassword(form.password))
      validationErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    if (!form.confirmPassword) validationErrors.confirmPassword = "Please confirm your new password";
    else if (form.confirmPassword !== form.password) validationErrors.confirmPassword = "Passwords do not match";
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await updatePassword(form.password);
      setSuccessMessage("Password changed successfully.");
      setForm({ password: "", confirmPassword: "" });
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Change Password</h1>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        {serverError && (
          <div className="mb-4">
            <ErrorAlert message={serverError} />
          </div>
        )}
        {successMessage && (
          <div className="mb-4">
            <SuccessAlert message={successMessage} />
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <FormInput
            label="New Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />
          <FormInput
            label="Confirm New Password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

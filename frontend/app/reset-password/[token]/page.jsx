"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PublicLayout from "@/components/PublicLayout";
import AuthCard from "@/components/AuthCard";
import FormInput from "@/components/FormInput";
import ErrorAlert from "@/components/ErrorAlert";
import SuccessAlert from "@/components/SuccessAlert";
import { resetPassword } from "@/services/auth.service";
import { getErrorMessage } from "@/utils/api";
import { isValidPassword, MIN_PASSWORD_LENGTH } from "@/utils/validators";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const validationErrors = {};
    if (!form.password) validationErrors.password = "Password is required";
    else if (!isValidPassword(form.password))
      validationErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    if (!form.confirmPassword) validationErrors.confirmPassword = "Please confirm your password";
    else if (form.confirmPassword !== form.password)
      validationErrors.confirmPassword = "Passwords do not match";
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await resetPassword(token, form.password);
      setSuccessMessage("Password successfully changed. Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <AuthCard title="Reset Password" subtitle="Choose a new password for your account.">
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <ErrorAlert message={serverError} />
          <SuccessAlert message={successMessage} />

          <FormInput
            label="New Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            disabled={!!successMessage}
          />

          <FormInput
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            disabled={!!successMessage}
          />

          <button
            type="submit"
            disabled={isSubmitting || !!successMessage}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </AuthCard>
    </PublicLayout>
  );
}

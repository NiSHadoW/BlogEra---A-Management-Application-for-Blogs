"use client";

import { useState } from "react";
import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import AuthCard from "@/components/AuthCard";
import FormInput from "@/components/FormInput";
import ErrorAlert from "@/components/ErrorAlert";
import SuccessAlert from "@/components/SuccessAlert";
import { forgotPassword } from "@/services/auth.service";
import { getErrorMessage } from "@/utils/api";
import { isValidEmail } from "@/utils/validators";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      const { message } = await forgotPassword(email.trim());
      setSuccessMessage(message || "If an account with that email exists, a reset link has been sent.");
      setEmail("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <AuthCard title="Forgot Password" subtitle="Enter your email and we'll send you a reset link.">
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <ErrorAlert message={error} />
          <SuccessAlert message={successMessage} />

          <FormInput
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Remembered your password?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </AuthCard>
    </PublicLayout>
  );
}

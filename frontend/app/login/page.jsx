"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import AuthCard from "@/components/AuthCard";
import FormInput from "@/components/FormInput";
import ErrorAlert from "@/components/ErrorAlert";
import SuccessAlert from "@/components/SuccessAlert";
import { useAuth } from "@/contexts/AuthContext";
import { getErrorMessage } from "@/utils/api";
import { isValidEmail } from "@/utils/validators";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const justRegistered = searchParams.get("registered") === "1";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const validationErrors = {};
    if (!form.email.trim()) validationErrors.email = "Email is required";
    else if (!isValidEmail(form.email)) validationErrors.email = "Enter a valid email address";
    if (!form.password) validationErrors.password = "Password is required";
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
      await login({ email: form.email.trim(), password: form.password });
      router.push("/dashboard");
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard title="Welcome back" subtitle="Login to manage your blogs.">
      <form onSubmit={handleSubmit} noValidate autoComplete="on" className="space-y-4">
        {justRegistered && !serverError && (
          <SuccessAlert message="Registration successful! Please login." />
        )}
        <ErrorAlert message={serverError} />

        <FormInput
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your mail yourmail@gmail.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="on"
        />

        <FormInput
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your 8 digit password here"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="new-password"
        />

        <div className="text-right">
          <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <PublicLayout>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </PublicLayout>
  );
}

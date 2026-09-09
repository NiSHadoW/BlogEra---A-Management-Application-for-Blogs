"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import AuthCard from "@/components/AuthCard";
import FormInput from "@/components/FormInput";
import ErrorAlert from "@/components/ErrorAlert";
import { register } from "@/services/auth.service";
import { getErrorMessage } from "@/utils/api";
import { isValidEmail, isValidPassword, MIN_PASSWORD_LENGTH } from "@/utils/validators";

const initialForm = { firstname: "", lastname: "", email: "", password: "", confirmPassword: "" };

function validate(form) {
  const errors = {};
  if (!form.firstname.trim()) errors.firstname = "First name is required";
  if (!form.lastname.trim()) errors.lastname = "Last name is required";
  if (!form.email.trim()) errors.email = "Email is required";
  else if (!isValidEmail(form.email)) errors.email = "Enter a valid email address";
  if (!form.password) errors.password = "Password is required";
  else if (!isValidPassword(form.password))
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  if (!form.confirmPassword) errors.confirmPassword = "Please confirm your password";
  else if (form.confirmPassword !== form.password) errors.confirmPassword = "Passwords do not match";
  return errors;
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await register({
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      router.push("/login?registered=1");
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <AuthCard title="Create an account" subtitle="Join BlogEra to start writing and reading blogs.">
        <form onSubmit={handleSubmit} noValidate autoComplete="off" className="space-y-4">
          <ErrorAlert message={serverError} />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="First Name"
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
              error={errors.firstname}
              required
              autoComplete="off"
            />
            <FormInput
              label="Last Name"
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              error={errors.lastname}
              required
              autoComplete="off"
            />
          </div>

          <FormInput
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            required
            autoComplete="off"
          />

          <FormInput
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            required
            autoComplete="new-password"
          />

          <FormInput
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
            autoComplete="new-password"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </AuthCard>
    </PublicLayout>
  );
}

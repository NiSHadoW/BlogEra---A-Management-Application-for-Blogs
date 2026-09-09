"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import Loader from "@/components/Loader";
import ErrorAlert from "@/components/ErrorAlert";
import { getUserById, updateUserStatus } from "@/services/user.service";
import { getErrorMessage } from "@/utils/api";
import { formatDate } from "@/utils/formatDate";

export default function AdminUserDetailPage() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isToggling, setIsToggling] = useState(false);

  const fetchUser = async () => {
    setIsLoading(true);
    setError("");
    try {
      const { data } = await getUserById(id);
      setUser(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleToggleStatus = async () => {
    if (!user) return;
    setIsToggling(true);
    setError("");
    try {
      const { data } = await updateUserStatus(user.id, !user.isActive);
      setUser((prev) => ({ ...prev, isActive: data.isActive }));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <Link href="/admin/users" className="mb-4 inline-block text-sm text-blue-600 hover:underline">
        ← Back to Users
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">User Details</h1>

      {error && (
        <div className="mb-4">
          <ErrorAlert message={error} />
        </div>
      )}

      {isLoading ? (
        <Loader label="Loading user..." />
      ) : !user ? null : (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <Avatar src={user.profileImage} name={`${user.firstname} ${user.lastname}`} size={64} />
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {user.firstname} {user.lastname}
              </p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Role</dt>
              <dd className="mt-1 font-medium capitalize text-gray-900">{user.role}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Status</dt>
              <dd className="mt-1">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    user.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Created Date</dt>
              <dd className="mt-1 font-medium text-gray-900">{formatDate(user.createdAt)}</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={handleToggleStatus}
            disabled={isToggling}
            className={`mt-6 rounded-md px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60 ${
              user.isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isToggling ? "Updating..." : user.isActive ? "Deactivate User" : "Activate User"}
          </button>
        </div>
      )}
    </div>
  );
}

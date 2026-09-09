"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllUsers, updateUserStatus } from "@/services/user.service";
import { getErrorMessage } from "@/utils/api";
import Loader from "@/components/Loader";
import ErrorAlert from "@/components/ErrorAlert";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [togglingId, setTogglingId] = useState(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const { data } = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    setTogglingId(user.id);
    setError("");
    try {
      const { data } = await updateUserStatus(user.id, !user.isActive);
      // Update this row in place rather than refetching the whole table (Rules #29).
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, isActive: data.isActive } : u)));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Users</h1>

      {error && (
        <div className="mb-4">
          <ErrorAlert message={error} />
        </div>
      )}

      {isLoading ? (
        <Loader label="Loading users..." />
      ) : users.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-300 bg-white py-12 text-center text-gray-500">
          No users found.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">User</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Email</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Role</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <Link href={`/admin/users/${u.id}`} className="hover:text-blue-600 hover:underline">
                      {u.firstname} {u.lastname}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3 capitalize text-gray-600">{u.role}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        u.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(u)}
                      disabled={togglingId === u.id}
                      className={`text-sm font-medium hover:underline disabled:cursor-not-allowed disabled:opacity-50 ${
                        u.isActive ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {togglingId === u.id ? "Updating..." : u.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

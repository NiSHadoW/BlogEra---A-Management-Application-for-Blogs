"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as authService from "@/services/auth.service";
import * as userService from "@/services/user.service";
import { getToken, setToken, removeToken, isTokenExpired } from "@/utils/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, firstname, lastname, email, role, isActive, profileImage }
  const [isLoading, setIsLoading] = useState(true); // true while we check localStorage/profile on first load

  // Fetches /users/profile and puts it in state. Used on initial load and
  // whenever something changes the profile (edit, image upload) so every
  // consumer (Navbar avatar included) re-renders with fresh data.
  const loadProfile = useCallback(async () => {
    const { data } = await userService.getProfile();
    setUser(data);
    return data;
  }, []);

  // On mount: if a non-expired token exists, trust it optimistically and
  // fetch the real profile. Any failure (expired/invalid/revoked token)
  // clears everything so the app falls back to the guest state.
  useEffect(() => {
    const token = getToken();
    if (!token || isTokenExpired(token)) {
      removeToken();
      setIsLoading(false);
      return;
    }
    loadProfile()
      .catch(() => {
        removeToken();
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, [loadProfile]);

  const login = async ({ email, password }) => {
    const { data } = await authService.login({ email, password });
    setToken(data.token);
    await loadProfile();
    return data;
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    role: user?.role ?? null,
    isLoading,
    login,
    logout,
    refreshProfile: loadProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

"use client";

import type { ReactNode } from "react";
import {
  createContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import {
  getToken,
  saveUser,
  getUser,
  removeUser,
  clearAuthData,
} from "../services/storage.service";
import { AuthService } from "../services/auth.service";
import { jwtDecode } from "jwt-decode";
import type { IUser } from "@/shared/types/user";
import { AUTH_UNAUTHORIZED_EVENT } from "../auth/auth-events";
import { initSocket, closeSocket } from "../services/io.service";

interface IAuthContextType {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<IAuthContextType>(
  {} as IAuthContextType,
);

interface IAuthProviderProps {
  children: ReactNode;
}

function subscribeNoop() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function AuthProvider({ children }: IAuthProviderProps) {
  const isClient = useSyncExternalStore(
    subscribeNoop,
    getClientSnapshot,
    getServerSnapshot,
  );

  const [user, setUser] = useState<IUser | null | undefined>(undefined);

  const persistedUser = useMemo<IUser | null>(() => {
    if (!isClient) return null;

    const token = getToken();
    const savedUser = getUser<IUser>();

    if (token && savedUser) {
      return savedUser;
    }

    if (token) {
      try {
        return jwtDecode<IUser>(token);
      } catch {
        return null;
      }
    }

    return null;
  }, [isClient]);

  const resolvedUser = user === undefined ? persistedUser : user;
  const isLoading = !isClient;

  useEffect(() => {
    const handleUnauthorized = () => {
      clearAuthData();
      setUser(null);
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);

    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, []);

  // Initialize WebSocket when user is authenticated
  useEffect(() => {
    if (resolvedUser) {
      console.log("🔌 Initializing WebSocket for user:", resolvedUser.email);
      initSocket();
    } else {
      console.log("🛑 Closing WebSocket - user logged out");
      closeSocket();
    }
  }, [resolvedUser]);

  const logout = () => {
    AuthService.logout();
    // closeSocket();
    clearAuthData();
    if (typeof window !== "undefined") {
      window.localStorage.setItem("first_access", "false");
    }
    setUser(null);
  };

  const updateUser = (newUser: IUser | null) => {
    setUser(newUser);
    if (newUser) {
      saveUser(newUser);
    } else {
      removeUser();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: resolvedUser,
        setUser: updateUser,
        logout,
        isAuthenticated: !!resolvedUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

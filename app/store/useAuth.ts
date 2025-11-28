import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LoginSession {
  token: string | null;
  setToken: (token: string) => void;
  setUsers: (data: any[]) => void; // store as array
  users: any[]; // array type
  clearToken: () => void;
  clearUsers: () => void;
}

export const useLoginSession = create<LoginSession>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      setUsers: (data) => set({ users: data }),
      users: [],
      clearToken: () => set({ token: null }),
      clearUsers: () => set({ users: [] }),
    }),
    {
      name: "login-session",
    }
  )
);

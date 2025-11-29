import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MenuItemsTypes } from "../components/dasrestaurosch/pos-displaypanem";

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

interface SelectedItemsState {
  selectedItems: MenuItemsTypes[];
  setSelectedItems: (data: MenuItemsTypes[]) => void;
  clearSelectedItems: () => void;
}

export const useSelectedData = create<SelectedItemsState>()(
  persist(
    (set) => ({
      selectedItems: [],
      setSelectedItems: (data) => set({ selectedItems: data }),
      clearSelectedItems: () => set({ selectedItems: [] }),
    }),
    {
      name: "selected-items", // localStorage key
    }
  )
);
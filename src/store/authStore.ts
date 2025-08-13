import { create } from "zustand";
import { persist } from "zustand/middleware";

type Role = "SUPERADMIN" | "SHOPADMIN" | null;

interface User {
  _id: string;
  name: string;
  phone: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  token: string | null;
  role: Role;
  shopId: string | null;
  user: User | null;
  setAuth: (
    token: string,
    role: Role,
    shopId?: string | null,
    user?: User | null
  ) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      shopId: null,
      user: null,
      setAuth: (
        token: string,
        role: Role,
        shopId: string | null = null,
        user: User | null = null
      ) => set({ token, role, shopId, user }),
      clearAuth: () =>
        set({ token: null, role: null, shopId: null, user: null }),
    }),
    {
      name: "auth-storage", // name of the item in the storage (must be unique)
    }
  )
);

export default useAuthStore;

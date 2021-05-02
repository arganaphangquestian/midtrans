import create from "zustand";

export const cartStore = create((set) => ({
  cart: undefined,
  addCart: (data) => set((state) => ({ cart: data })),
}));

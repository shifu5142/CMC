"use client";

import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  commandMenuOpen: boolean;
  chatOpen: boolean;
  inviteModalOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setCommandMenuOpen: (open: boolean) => void;
  toggleCommandMenu: () => void;
  setChatOpen: (open: boolean) => void;
  setInviteModalOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  commandMenuOpen: false,
  chatOpen: false,
  inviteModalOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setCommandMenuOpen: (open) => set({ commandMenuOpen: open }),
  toggleCommandMenu: () =>
    set((s) => ({ commandMenuOpen: !s.commandMenuOpen })),
  setChatOpen: (open) => set({ chatOpen: open }),
  setInviteModalOpen: (open) => set({ inviteModalOpen: open }),
}));

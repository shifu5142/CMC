"use client";

import { useEffect } from "react";

interface HotkeyOptions {
  /** Lowercase key, e.g. "k". */
  key: string;
  /** Require ctrl or cmd. */
  mod?: boolean;
  shift?: boolean;
}

/**
 * Bind a global keyboard shortcut.
 *   useHotkey({ key: "k", mod: true }, () => setOpen(true));
 */
export function useHotkey(
  { key, mod = false, shift = false }: HotkeyOptions,
  handler: (e: KeyboardEvent) => void,
) {
  useEffect(() => {
    if (!key) return;

    const onKey = (e: KeyboardEvent) => {
      const pressed = e.key?.toLowerCase();
      const target = key.toLowerCase();
      if (!pressed || pressed !== target) return;

      const isMod = mod ? e.metaKey || e.ctrlKey : !e.metaKey && !e.ctrlKey;
      const isShift = shift ? e.shiftKey : !e.shiftKey;
      if (!isMod || !isShift) return;

      e.preventDefault();
      handler(e);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [key, mod, shift, handler]);
}

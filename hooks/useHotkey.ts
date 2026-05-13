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
    const onKey = (e: KeyboardEvent) => {
      const isMod = mod ? e.metaKey || e.ctrlKey : true;
      const isShift = shift ? e.shiftKey : true;
      if (e.key.toLowerCase() === key.toLowerCase() && isMod && isShift) {
        e.preventDefault();
        handler(e);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [key, mod, shift, handler]);
}

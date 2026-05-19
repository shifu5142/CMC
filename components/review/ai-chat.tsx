"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUIStore } from "@/store/useUIStore";
import { cn, uid } from "@/lib/utils";
import { api } from "@/lib/api";
import type { ApiResponse, ChatMessage } from "@/types";

/**
 * Floating AI chat sidebar. Backed by `/api/chat` mock route.
 */
export function AIChat() {
  const open = useUIStore((s) => s.chatOpen);
  const setOpen = useUIStore((s) => s.setChatOpen);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uid("msg"),
      role: "assistant",
      content:
        "Hey, I'm CMC. Ask me about any issue, request a fix, or have me explain a finding.",
      createdAt: new Date().toISOString(),
    },
  ]);

  async function send() {
    const trimmed = input.trim();
    if (!trimmed || pending) return;
    const userMsg: ChatMessage = {
      id: uid("msg"),
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setPending(true);
    try {
      const res = await api.post<ApiResponse<ChatMessage>>("/api/chat", {
        messages: [...messages, userMsg],
      });
      if (res.ok) setMessages((m) => [...m, res.data]);
    } finally {
      setPending(false);
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.aside
            key="panel"
            initial={{ x: 360 }}
            animate={{ x: 0 }}
            exit={{ x: 360 }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border/60 bg-background/95 backdrop-blur-xl"
          >
            <header className="flex h-14 items-center justify-between border-b border-border/60 px-4">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-md bg-primary/15 text-primary">
                  <Sparkles className="size-3.5" />
                </span>
                <span className="text-sm font-semibold">Ask CMC</span>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto p-4 scrollbar-thin">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex items-start gap-2",
                    m.role === "user" && "flex-row-reverse",
                  )}
                >
                  <Avatar className="h-7 w-7">
                    <AvatarFallback
                      className={cn(
                        m.role === "assistant" && "bg-primary/15 text-primary",
                      )}
                    >
                      {m.role === "assistant" ? (
                        <Sparkles className="size-3.5" />
                      ) : (
                        "U"
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-xl px-3 py-2 text-sm",
                      m.role === "assistant"
                        ? "bg-card border border-border/60"
                        : "bg-primary text-primary-foreground",
                    )}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {pending ? (
                <p className="text-xs text-muted-foreground">CMC is thinking…</p>
              ) : null}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex gap-2 border-t border-border/60 p-3"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about an issue or request a fix…"
              />
              <Button type="submit" size="icon" disabled={!input.trim() || pending}>
                <Send className="size-4" />
              </Button>
            </form>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

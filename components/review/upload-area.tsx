"use client";

import { useCallback, useState } from "react";
import { Upload, FileCode2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface UploadAreaProps {
  /** Called with the file's text contents and filename. */
  onLoad: (code: string, filename: string) => void;
}

const MAX_BYTES = 1024 * 1024; // 1 MB
const ALLOWED = /\.(ts|tsx|js|jsx|py|go|rs|java|cs|cpp|rb|php|swift|kt|kts)$/i;

export function UploadArea({ onLoad }: UploadAreaProps) {
  const [dragOver, setDragOver] = useState(false);
  const [loaded, setLoaded] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (file.size > MAX_BYTES) {
        toast.error("File too large (max 1MB).");
        return;
      }
      if (!ALLOWED.test(file.name)) {
        toast.error("Unsupported file type.");
        return;
      }
      const text = await file.text();
      onLoad(text, file.name);
      setLoaded(file.name);
      toast.success(`Loaded ${file.name}`);
    },
    [onLoad],
  );

  return (
    <motion.label
      htmlFor="file-upload"
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
      }}
      whileHover={{ scale: 1.005 }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/30 p-6 text-center transition-colors",
        dragOver && "border-primary bg-primary/5",
      )}
    >
      <div className="grid h-10 w-10 place-items-center rounded-md bg-muted text-muted-foreground">
        {loaded ? (
          <CheckCircle2 className="size-5 text-emerald-400" />
        ) : (
          <Upload className="size-5" />
        )}
      </div>
      <p className="mt-3 text-sm font-medium">
        {loaded ? `Loaded ${loaded}` : "Drop a file or click to upload"}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        .ts .tsx .js .py .go .rs .java — max 1MB
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="pointer-events-none mt-4"
        tabIndex={-1}
      >
        <FileCode2 className="size-3.5" />
        Choose file
      </Button>
      <input
        id="file-upload"
        type="file"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </motion.label>
  );
}

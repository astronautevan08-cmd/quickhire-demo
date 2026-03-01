"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

type Option = { label: string; value: string };

type SoftSelectProps = {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
};

export default function SoftSelect({
  value,
  onChange,
  options,
  placeholder = "Select",
  icon,
  className = "",
}: SoftSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selectedLabel = useMemo(() => {
    const found = options.find((o) => o.value === value);
    return found?.label ?? placeholder;
  }, [options, value, placeholder]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          "w-full h-10 px-3 rounded-md",
          "bg-transparent",
          "flex items-center justify-between gap-2",
          "text-sm",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
        ].join(" ")}
      >
        <div className="flex items-center gap-2 min-w-0">
          {icon ? <span className="shrink-0 text-muted-foreground">{icon}</span> : null}
          <span
            className={[
              "truncate",
              value ? "text-foreground" : "text-muted-foreground",
            ].join(" ")}
          >
            {selectedLabel}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className={[
            "absolute z-50 mt-2 w-full",
            "rounded-xl border border-border bg-background",
            "shadow-lg shadow-black/5",
            "overflow-hidden",
          ].join(" ")}
        >
          <div className="max-h-60 overflow-auto p-1">
            {options.map((opt) => {
              const active = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={[
                    "w-full text-left px-3 py-2 rounded-lg",
                    "text-sm flex items-center justify-between gap-3",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted/50",
                  ].join(" ")}
                >
                  <span className="truncate">{opt.label}</span>
                  {active ? <Check className="w-4 h-4 shrink-0" /> : <span className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
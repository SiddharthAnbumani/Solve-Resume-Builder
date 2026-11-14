"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Password field with a show/hide toggle (a button, so it works on touch).
export default function PasswordInput({ className, ...props }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        {...props}
        type={show ? "text" : "password"}
        className={`h-11 pr-11 ${className ?? ""}`}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={show ? "Hide password" : "Show password"}
        aria-pressed={show}
        onClick={() => setShow((s) => !s)}
        className="absolute top-1/2 right-1 size-9 -translate-y-1/2 text-muted-foreground"
      >
        {show ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  );
}

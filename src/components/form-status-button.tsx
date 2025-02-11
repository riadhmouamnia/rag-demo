"use client";
import { ComponentPropsWithoutRef } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";

export default function FormStatusButton({
  disabled,
  children,
  ...rest
}: ComponentPropsWithoutRef<"button">) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={disabled || pending} {...rest}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : children}
    </Button>
  );
}

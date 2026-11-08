"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
}

export function Alert({
  className,
  title,
  description,
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "relative w-full rounded-lg border border-border p-4",
        className
      )}
      {...props}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {description && <AlertDescription>{description}</AlertDescription>}
    </div>
  );
}

export function AlertTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5 className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />
  );
}

export function AlertDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}

export function AlertAction({
  className,
  ...props
}: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <Button variant="outline" size="sm" className={cn("mt-3 h-auto", className)} {...props} />
  );
}

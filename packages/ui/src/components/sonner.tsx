"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius-xl)",
          "--success-bg": "var(--popover)",
          "--success-text": "var(--popover-foreground)",
          "--error-bg": "var(--popover)",
          "--error-text": "var(--popover-foreground)",
          "--warning-bg": "var(--popover)",
          "--warning-text": "var(--popover-foreground)",
          "--info-bg": "var(--popover)",
          "--info-text": "var(--popover-foreground)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "!text-sm !font-medium shadow-lg",
          title: "!text-sm !font-semibold",
          description: "!text-xs !text-muted-foreground",
          actionButton: "!text-xs !font-medium",
          cancelButton: "!text-xs",
          icon: "!mt-0.5",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

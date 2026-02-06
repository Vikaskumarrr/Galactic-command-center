"use client";

import { TamboProvider } from "@tambo-ai/react";
import { tamboComponents } from "@/lib/tambo-components";

interface TamboWrapperProps {
  children: React.ReactNode;
  apiKey: string;
}

export function TamboWrapper({ children, apiKey }: TamboWrapperProps) {
  return (
    <TamboProvider apiKey={apiKey} components={tamboComponents}>
      {children}
    </TamboProvider>
  );
}

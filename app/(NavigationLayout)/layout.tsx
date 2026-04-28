import { Navigation } from "@/components/Navigation";
import React from "react";

export default function NavigationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation>{children}</Navigation>
    </>
  );
}

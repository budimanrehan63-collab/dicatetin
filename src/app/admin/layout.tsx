"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/components/layouts/AdminSidebar";
import { AdminHeader } from "@/components/layouts/AdminHeader";
import { setAppCookie } from "@/lib/utils/cookies";

export default function AdminAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [impersonatingUser, setImpersonatingUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setAppCookie("dicatetin_session", "admin", 365);
      setAppCookie("dicatetin_admin_session", "admin", 365);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-text-primary flex">
      {/* Desktop Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-12">
        <AdminHeader
          adminEmail="fauzymnf29@gmail.com"
          impersonatingUser={impersonatingUser}
          onExitImpersonation={() => setImpersonatingUser(null)}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

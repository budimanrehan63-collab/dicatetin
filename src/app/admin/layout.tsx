"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/components/layouts/AdminSidebar";
import { AdminHeader } from "@/components/layouts/AdminHeader";

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
      const isProd = window.location.protocol === "https:";
      const secureFlag = isProd ? "; Secure" : "";
      document.cookie = `dicatetin_session=admin; path=/; max-age=2592000; SameSite=Lax${secureFlag}`;
      document.cookie = `dicatetin_admin_session=admin; path=/; max-age=2592000; SameSite=Lax${secureFlag}`;
      try {
        localStorage.setItem("dicatetin_session", "admin");
        localStorage.setItem("dicatetin_admin_session", "admin");
      } catch (e) {}
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

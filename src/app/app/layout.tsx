"use client";

import React, { useState } from "react";
import { UserSidebar } from "@/components/layouts/UserSidebar";
import { UserHeader } from "@/components/layouts/UserHeader";
import { MobileBottomNav } from "@/components/layouts/MobileBottomNav";
import { QuickRecordModal } from "@/components/transactions/QuickRecordModal";
import { setAppCookie } from "@/lib/utils/cookies";

export default function UserAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [quickRecordOpen, setQuickRecordOpen] = useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("dicatetin_session") || "user";
      const storedAdmin = localStorage.getItem("dicatetin_admin_session");

      setAppCookie("dicatetin_session", stored, 365);
      if (storedAdmin === "admin") {
        setAppCookie("dicatetin_admin_session", "admin", 365);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-text-primary flex">
      {/* Desktop Sidebar */}
      <UserSidebar userPlan="pro" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        <UserHeader
          userName="Fauzy"
          userEmail="fauzy@example.com"
          unreadNotificationsCount={0}
          onOpenQuickRecord={() => setQuickRecordOpen(true)}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onOpenQuickRecord={() => setQuickRecordOpen(true)} />

      {/* Global Floating Quick Record Modal */}
      <QuickRecordModal
        isOpen={quickRecordOpen}
        onClose={() => setQuickRecordOpen(false)}
      />
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { FileText, Zap, Shield, Bot, Search, Filter } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { formatDateID } from "@/lib/utils/date";

const SAMPLE_AI_LOGS = [
  {
    id: "ai-1",
    user: "Fauzy Pratama",
    task: "receipt",
    provider: "Google Gemini 1.5 Flash",
    tokensIn: 840,
    tokensOut: 190,
    costEstimate: "Rp12",
    latency: "1.1s",
    status: "success",
    timestamp: "2026-10-06T13:40:12Z",
  },
  {
    id: "ai-2",
    user: "Dewi Lestari",
    task: "voice",
    provider: "Google Gemini 1.5 Flash",
    tokensIn: 450,
    tokensOut: 65,
    costEstimate: "Rp6",
    latency: "1.4s",
    status: "success",
    timestamp: "2026-10-06T12:15:33Z",
  },
  {
    id: "ai-3",
    user: "Rina Safitri",
    task: "text",
    provider: "OpenAI GPT-4o-mini",
    tokensIn: 120,
    tokensOut: 45,
    costEstimate: "Rp2",
    latency: "0.8s",
    status: "success",
    timestamp: "2026-10-06T11:05:20Z",
  },
  {
    id: "ai-4",
    user: "Budi Santoso",
    task: "receipt",
    provider: "Google Gemini 1.5 Flash",
    tokensIn: 920,
    tokensOut: 0,
    costEstimate: "Rp0",
    latency: "20.1s",
    status: "timeout_failover",
    timestamp: "2026-10-06T09:30:11Z",
    error: "Provider 1 Timeout > 20s -> Failover to OpenAI berhasil",
  },
];

const SAMPLE_ADMIN_LOGS = [
  {
    id: "adm-1",
    admin: "Superadmin (admin@dicatetin.id)",
    action: "APPROVE_USER",
    target: "Rina Safitri (rina.safitri@gmail.com)",
    detail: "ACC pendaftaran paket Pro 30 hari",
    timestamp: "2026-10-06T11:30:00Z",
  },
  {
    id: "adm-2",
    admin: "Superadmin (admin@dicatetin.id)",
    action: "UPDATE_PLAN",
    target: "Paket Pro",
    detail: "Mengubah kuota AI menjadi 300 aksi/bulan",
    timestamp: "2026-10-05T14:20:00Z",
  },
  {
    id: "adm-3",
    admin: "Superadmin (admin@dicatetin.id)",
    action: "IMPERSONATE_USER",
    target: "Fauzy Pratama",
    detail: "Troubleshooting sesi dashboard",
    timestamp: "2026-10-04T10:10:00Z",
  },
];

export default function AdminLogsPage() {
  const [activeTab, setActiveTab] = useState<"ai" | "admin" | "webhook">("ai");
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading tracking-tight text-text-primary">
          Log Aktivitas & Audit Trail
        </h1>
        <p className="text-xs md:text-sm text-text-secondary mt-1">
          Pantau pemanggilan AI, tindakan administrator, dan log webhook secara real-time.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <button
          onClick={() => setActiveTab("ai")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
            activeTab === "ai"
              ? "bg-primary text-primary-foreground shadow-subtle"
              : "text-text-secondary hover:text-text-primary hover:bg-surface"
          )}
        >
          <Zap className="w-4 h-4" />
          <span>Log Pemakaian AI</span>
        </button>

        <button
          onClick={() => setActiveTab("admin")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
            activeTab === "admin"
              ? "bg-primary text-primary-foreground shadow-subtle"
              : "text-text-secondary hover:text-text-primary hover:bg-surface"
          )}
        >
          <Shield className="w-4 h-4" />
          <span>Log Aktivitas Admin</span>
        </button>

        <button
          onClick={() => setActiveTab("webhook")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
            activeTab === "webhook"
              ? "bg-primary text-primary-foreground shadow-subtle"
              : "text-text-secondary hover:text-text-primary hover:bg-surface"
          )}
        >
          <Bot className="w-4 h-4" />
          <span>Log Webhook Telegram & Midtrans</span>
        </button>
      </div>

      {/* AI LOGS TAB */}
      {activeTab === "ai" && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-surface text-text-secondary font-semibold">
                  <th className="p-4">Waktu</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Task</th>
                  <th className="p-4">Provider / Model</th>
                  <th className="p-4">Tokens (In/Out)</th>
                  <th className="p-4">Latensi</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {SAMPLE_AI_LOGS.map((log) => (
                  <tr key={log.id} className="hover:bg-surface/50 transition-colors">
                    <td className="p-4 font-mono text-text-secondary">
                      {formatDateID(log.timestamp, "datetime")}
                    </td>
                    <td className="p-4 font-bold text-text-primary">{log.user}</td>
                    <td className="p-4 uppercase font-semibold">
                      <Badge variant="outline">{log.task}</Badge>
                    </td>
                    <td className="p-4 font-mono">{log.provider}</td>
                    <td className="p-4 font-mono text-text-secondary">
                      {log.tokensIn} / {log.tokensOut}
                    </td>
                    <td className="p-4 font-mono font-semibold text-primary">{log.latency}</td>
                    <td className="p-4">
                      {log.status === "success" ? (
                        <Badge variant="income">Sukses</Badge>
                      ) : (
                        <Badge variant="warning">Failover</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ADMIN LOGS TAB */}
      {activeTab === "admin" && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-surface text-text-secondary font-semibold">
                  <th className="p-4">Waktu</th>
                  <th className="p-4">Admin</th>
                  <th className="p-4">Aksi</th>
                  <th className="p-4">Target</th>
                  <th className="p-4">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {SAMPLE_ADMIN_LOGS.map((log) => (
                  <tr key={log.id} className="hover:bg-surface/50 transition-colors">
                    <td className="p-4 font-mono text-text-secondary">
                      {formatDateID(log.timestamp, "datetime")}
                    </td>
                    <td className="p-4 font-bold text-text-primary">{log.admin}</td>
                    <td className="p-4 font-mono font-semibold">
                      <Badge variant="default">{log.action}</Badge>
                    </td>
                    <td className="p-4 text-text-primary">{log.target}</td>
                    <td className="p-4 text-text-secondary">{log.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* WEBHOOK LOGS TAB */}
      {activeTab === "webhook" && (
        <Card className="p-6 text-center text-xs text-text-secondary">
          Webhook Telegram & Midtrans aktif beroperasi normal tanpa kegagalan transmisi.
        </Card>
      )}
    </div>
  );
}

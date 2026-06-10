"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCheck, X, ExternalLink, Filter } from "lucide-react";
import { useAdminReports, useResolveReport, useDismissReport } from "@/hooks/use-admin";
import type { AdminReport } from "@/hooks/use-admin";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3001";
function absoluteUrl(url: string) {
  return url.startsWith("http") ? url : `${SERVER_URL}${url}`;
}

function ReporterAvatar({ reporter }: { reporter: AdminReport["reporter"] }) {
  const initials = reporter.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  if (reporter.avatarUrl) {
    return (
      <Image
        src={absoluteUrl(reporter.avatarUrl)}
        alt={reporter.name}
        width={28}
        height={28}
        className="rounded-full object-cover"
        unoptimized
      />
    );
  }
  return (
    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-none text-[0.6rem] font-semibold text-primary">
      {initials}
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  open: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  resolved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  dismissed: "bg-muted text-muted-foreground",
};

function ReportCard({ report }: { report: AdminReport }) {
  const resolve = useResolveReport();
  const dismiss = useDismissReport();
  const isOpen = report.status === "open";

  const targetHref =
    report.targetType === "user"
      ? `/users/${report.targetId}`
      : `/redesigns/${report.targetId}`;

  return (
    <div className={`rounded-2xl border bg-card p-4 flex flex-col gap-3 transition-opacity ${!isOpen ? "opacity-60" : "border-border"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-[0.6rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${STATUS_STYLES[report.status] ?? "bg-muted text-muted-foreground"}`}>
              {report.status}
            </span>
            <span className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase">
              {report.targetType}
            </span>
          </div>
          <p className="text-sm font-medium text-foreground leading-snug">{report.reason}</p>
        </div>
        <a
          href={targetHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-none h-7 w-7 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="View target"
        >
          <ExternalLink size={12} />
        </a>
      </div>

      <div className="flex items-center gap-2">
        <ReporterAvatar reporter={report.reporter} />
        <div className="min-w-0">
          <p className="text-xs font-medium text-foreground truncate">{report.reporter.name}</p>
          <p className="text-[0.65rem] text-muted-foreground">@{report.reporter.username}</p>
        </div>
        <span className="ml-auto text-[0.65rem] text-muted-foreground flex-none">
          {new Date(report.createdAt).toLocaleDateString()}
        </span>
      </div>

      {isOpen && (
        <div className="flex items-center gap-2 pt-1 border-t border-border">
          <button
            onClick={() => resolve.mutate(report.id)}
            disabled={resolve.isPending}
            className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <CheckCheck size={12} />
            {resolve.isPending ? "…" : "Resolve"}
          </button>
          <button
            onClick={() => dismiss.mutate(report.id)}
            disabled={dismiss.isPending}
            className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            <X size={12} />
            {dismiss.isPending ? "…" : "Dismiss"}
          </button>
        </div>
      )}
    </div>
  );
}

function ReportRow({ report }: { report: AdminReport }) {
  const resolve = useResolveReport();
  const dismiss = useDismissReport();
  const isOpen = report.status === "open";

  const targetHref =
    report.targetType === "user"
      ? `/users/${report.targetId}`
      : `/redesigns/${report.targetId}`;

  return (
    <tr className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <ReporterAvatar reporter={report.reporter} />
          <div>
            <p className="text-sm font-medium text-foreground leading-tight">{report.reporter.name}</p>
            <p className="text-xs text-muted-foreground">@{report.reporter.username}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        <span className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase">
          {report.targetType}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-foreground max-w-xs hidden md:table-cell">
        <p className="truncate">{report.reason}</p>
      </td>
      <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground">
        {new Date(report.createdAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-3">
        <span className={`text-[0.6rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${STATUS_STYLES[report.status] ?? "bg-muted text-muted-foreground"}`}>
          {report.status}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5 justify-end">
          <a
            href={targetHref}
            target="_blank"
            rel="noopener noreferrer"
            className="h-7 w-7 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="View target"
          >
            <ExternalLink size={12} />
          </a>
          {isOpen && (
            <>
              <button
                onClick={() => resolve.mutate(report.id)}
                disabled={resolve.isPending}
                className="h-7 px-2.5 flex items-center gap-1 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <CheckCheck size={11} />
                Resolve
              </button>
              <button
                onClick={() => dismiss.mutate(report.id)}
                disabled={dismiss.isPending}
                className="h-7 px-2.5 flex items-center gap-1 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              >
                <X size={11} />
                Dismiss
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

type StatusFilter = "all" | "open" | "resolved" | "dismissed";

export default function AdminReportsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("open");
  const [view, setView] = useState<"table" | "cards">("table");

  const { data: reports, isLoading } = useAdminReports(
    statusFilter === "all" ? undefined : statusFilter,
  );

  return (
    <div className="px-4 md:px-8 py-6 max-w-6xl">
      <div className="mb-6">
        <h1
          className="text-2xl font-extrabold text-foreground"
          style={{ fontFamily: "'Bricolage Grotesque', system-ui" }}
        >
          Reports
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">User and redesign reports submitted by the community.</p>
      </div>

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-1 rounded-xl border border-border p-1">
          <Filter size={13} className="text-muted-foreground ml-1.5" />
          {(["open", "resolved", "dismissed", "all"] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${statusFilter === s ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex rounded-xl border border-border overflow-hidden">
          <button
            onClick={() => setView("table")}
            className={`px-3 py-1.5 text-xs font-semibold transition-colors ${view === "table" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Table
          </button>
          <button
            onClick={() => setView("cards")}
            className={`px-3 py-1.5 text-xs font-semibold transition-colors border-l border-border ${view === "cards" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Cards
          </button>
        </div>
        {reports && <span className="text-xs text-muted-foreground">{reports.length} report{reports.length !== 1 ? "s" : ""}</span>}
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && (!reports || reports.length === 0) && (
        <div className="text-center py-20">
          <p className="font-semibold text-foreground">No reports</p>
          <p className="text-sm text-muted-foreground mt-1">
            {statusFilter === "all" ? "No reports have been submitted yet." : `No ${statusFilter} reports.`}
          </p>
        </div>
      )}

      {!isLoading && reports && reports.length > 0 && (
        view === "table" ? (
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Reporter</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Type</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Reason</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Date</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <ReportRow key={report.id} report={report} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )
      )}
    </div>
  );
}

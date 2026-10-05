"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useToast, ToastContainer } from "@/components/Toast";
import { ClientCardSkeleton, SkeletonStyles } from "@/components/Skeleton";

type ProjectStatus = "prospect" | "active" | "on_hold" | "completed" | "churned";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  status: ProjectStatus;
  notes: string | null;
  created_at: string;
}

const STATUS_META: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
  prospect:  { label: "Prospect",   color: "#6366F1", bg: "#EEF2FF" },
  active:    { label: "Active",     color: "#059669", bg: "#ECFDF5" },
  on_hold:   { label: "On Hold",    color: "#D97706", bg: "#FFFBEB" },
  completed: { label: "Completed",  color: "#2563EB", bg: "#EFF6FF" },
  churned:   { label: "Churned",    color: "#DC2626", bg: "#FEF2F2" },
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  const m = STATUS_META[status];
  return (
    <span style={{
      padding: "3px 10px", borderRadius: 20, fontSize: 11,
      fontWeight: 700, background: m.bg, color: m.color,
      letterSpacing: 0.4, textTransform: "uppercase",
    }}>
      {m.label}
    </span>
  );
}

const ALL_STATUSES: ProjectStatus[] = ["prospect", "active", "on_hold", "completed", "churned"];

export default function ClientsPage() {
  const supabase = createClient();
  const { toasts, toast, removeToast } = useToast();

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ProjectStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadClients = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(error.message);
    } else {
      setClients(data ?? []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => { loadClients(); }, [loadClients]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    setDeletingId(id);
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (error) {
      toast.error(`Failed to delete: ${error.message}`);
    } else {
      setClients((prev) => prev.filter((c) => c.id !== id));
      toast.success(`${name} removed.`);
    }
    setDeletingId(null);
  };

  const filtered = clients.filter((c) => {
    const matchStatus = filter === "all" || c.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.company ?? "").toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  // Stats
  const statCounts = ALL_STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = clients.filter((c) => c.status === s).length;
    return acc;
  }, {});

  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FA", padding: "48px 20px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      <SkeletonStyles />
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <Link href="/" style={{ color: "#224F34", fontWeight: 700, textDecoration: "none", fontSize: 13, display: "block", marginBottom: 6 }}>
              ← Back to Home
            </Link>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#101828", margin: 0 }}>Client Database</h1>
            <p style={{ color: "#667085", fontSize: 14, marginTop: 4 }}>
              {clients.length} client{clients.length !== 1 ? "s" : ""} saved
            </p>
          </div>
          <Link
            href="/clients/new"
            id="add-client-btn"
            style={{
              background: "#224F34", color: "#fff", padding: "12px 22px", borderRadius: 10,
              textDecoration: "none", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 8,
              boxShadow: "0 4px 16px rgba(34,79,52,0.25)", transition: "all 0.2s",
            }}
          >
            + Add Client
          </Link>
        </div>

        {/* Stats bar */}
        {!loading && clients.length > 0 && (
          <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
            {ALL_STATUSES.map((s) => {
              const m = STATUS_META[s];
              return (
                <button
                  key={s}
                  onClick={() => setFilter(filter === s ? "all" : s)}
                  style={{
                    padding: "8px 16px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
                    border: `2px solid ${filter === s ? m.color : "#e2e8e4"}`,
                    background: filter === s ? m.bg : "#fff",
                    color: filter === s ? m.color : "#667085",
                    fontWeight: 600, fontSize: 13, transition: "all 0.18s",
                    display: "flex", alignItems: "center", gap: 8,
                  }}
                >
                  <span style={{ fontSize: 17, fontWeight: 800 }}>{statCounts[s]}</span>
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Search */}
        <div style={{ marginBottom: 24 }}>
          <input
            type="search"
            id="client-search"
            placeholder="Search by name, email, or company…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", maxWidth: 400, padding: "10px 16px", border: "1.5px solid #e2e8e4",
              borderRadius: 10, fontSize: 14, background: "#fff", outline: "none", fontFamily: "inherit",
              color: "#101828",
            }}
          />
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2, 3].map((i) => <ClientCardSkeleton key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && clients.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 20px", background: "#fff", borderRadius: 18, border: "1px solid #e2e8e4" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🧑‍💼</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#101828", margin: "0 0 8px" }}>No clients yet</h2>
            <p style={{ color: "#667085", fontSize: 14, marginBottom: 24 }}>Add your first client to get started.</p>
            <Link href="/clients/new" style={{ background: "#224F34", color: "#fff", padding: "12px 24px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
              Add Your First Client
            </Link>
          </div>
        )}

        {/* Filtered empty */}
        {!loading && clients.length > 0 && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 20px", color: "#667085" }}>
            <p>No clients match your search.</p>
            <button onClick={() => { setSearch(""); setFilter("all"); }} style={{ background: "none", border: "none", color: "#224F34", fontWeight: 700, cursor: "pointer", textDecoration: "underline", fontFamily: "inherit" }}>
              Clear filters
            </button>
          </div>
        )}

        {/* Client grid */}
        {!loading && filtered.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((client) => (
              <div
                key={client.id}
                style={{
                  background: "#fff", border: "1px solid #e2e8e4", borderRadius: 14, padding: 24,
                  display: "flex", alignItems: "center", gap: 20,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  transition: "box-shadow 0.2s, border-color 0.2s",
                  opacity: deletingId === client.id ? 0.5 : 1,
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
                  background: STATUS_META[client.status].bg,
                  color: STATUS_META[client.status].color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontSize: 16, border: `2px solid ${STATUS_META[client.status].color}22`,
                }}>
                  {getInitials(client.name)}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: 16, color: "#101828" }}>{client.name}</span>
                    <StatusBadge status={client.status} />
                  </div>
                  <p style={{ margin: "3px 0 0", fontSize: 13, color: "#667085" }}>
                    {client.email}
                    {client.phone && <> · {client.phone}</>}
                    {client.company && <> · {client.company}</>}
                  </p>
                  {client.notes && (
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "#98A2B3", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 400 }}>
                      {client.notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <a
                    href={`mailto:${client.email}`}
                    title="Send email"
                    style={{ padding: "7px 12px", borderRadius: 8, border: "1.5px solid #e2e8e4", textDecoration: "none", fontSize: 14, color: "#344054", background: "#fff", cursor: "pointer" }}
                  >
                    ✉️
                  </a>
                  <button
                    id={`delete-client-${client.id}`}
                    onClick={() => handleDelete(client.id, client.name)}
                    disabled={deletingId === client.id}
                    title="Delete client"
                    style={{
                      padding: "7px 12px", borderRadius: 8, border: "1.5px solid #FCA5A5",
                      background: "#FEF2F2", color: "#DC2626", cursor: "pointer",
                      fontSize: 14, fontFamily: "inherit",
                    }}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

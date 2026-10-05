"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { CreateTodoSchema, formatZodError } from "@/utils/schemas";
import { useToast, ToastContainer } from "@/components/Toast";
import { TodoSkeleton, SkeletonStyles } from "@/components/Skeleton";

type TodoCategory = "work" | "personal" | "urgent" | "other";
type TodoPriority = "low" | "medium" | "high";

interface Todo {
  id: string;
  task: string;
  is_completed: boolean;
  created_at: string;
  due_date: string | null;
  category: TodoCategory;
  priority: TodoPriority;
  user_id?: string | null;
}

const CATEGORY_META: Record<TodoCategory, { label: string; emoji: string; color: string; bg: string }> = {
  work:     { label: "Work",     emoji: "💼", color: "#2563EB", bg: "#EFF6FF" },
  personal: { label: "Personal", emoji: "🏠", color: "#7C3AED", bg: "#F5F3FF" },
  urgent:   { label: "Urgent",   emoji: "🔥", color: "#DC2626", bg: "#FEF2F2" },
  other:    { label: "Other",    emoji: "📌", color: "#667085", bg: "#F8F9FA" },
};

const PRIORITY_META: Record<TodoPriority, { label: string; color: string }> = {
  low:    { label: "Low",    color: "#059669" },
  medium: { label: "Med",    color: "#D97706" },
  high:   { label: "High",   color: "#DC2626" },
};

function isOverdue(due_date: string | null): boolean {
  if (!due_date) return false;
  return new Date(due_date) < new Date(new Date().toDateString());
}

function formatDate(due_date: string | null): string {
  if (!due_date) return "";
  return new Date(due_date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const inputStyle: React.CSSProperties = {
  background: "#fff",
  border: "1.5px solid #d0d5dd",
  borderRadius: 8,
  fontSize: 14,
  color: "#101828",
  outline: "none",
  fontFamily: "inherit",
  padding: "10px 14px",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

export default function TodosPage() {
  const supabase = createClient();
  const { toasts, toast, removeToast } = useToast();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [newTask, setNewTask] = useState("");
  const [newCategory, setNewCategory] = useState<TodoCategory>("other");
  const [newPriority, setNewPriority] = useState<TodoPriority>("medium");
  const [newDueDate, setNewDueDate] = useState("");

  // Filter state
  const [filterCategory, setFilterCategory] = useState<TodoCategory | "all">("all");
  const [showCompleted, setShowCompleted] = useState(true);

  // Load data
  const loadData = useCallback(async () => {
    setLoading(true);
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    setUser(currentUser);

    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(error.message);
    } else {
      setTodos(data ?? []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => { loadData(); }, [loadData]);

  // Add todo with Zod validation
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = CreateTodoSchema.safeParse({
      task: newTask,
      category: newCategory,
      priority: newPriority,
      due_date: newDueDate || null,
    });

    if (!parsed.success) {
      toast.error(formatZodError(parsed.error));
      return;
    }

    setSubmitting(true);
    const { data, error } = await supabase
      .from("todos")
      .insert({ ...parsed.data, user_id: user?.id ?? undefined })
      .select()
      .single();

    if (error) {
      toast.error(error.message);
    } else if (data) {
      setTodos((prev) => [data, ...prev]);
      setNewTask("");
      setNewDueDate("");
      setNewCategory("other");
      setNewPriority("medium");
      toast.success("Todo added!");
    }
    setSubmitting(false);
  };

  // Toggle completion (optimistic)
  const handleToggleComplete = async (todo: Todo) => {
    const updated = !todo.is_completed;
    setTodos((prev) => prev.map((t) => t.id === todo.id ? { ...t, is_completed: updated } : t));

    const { error } = await supabase.from("todos").update({ is_completed: updated }).eq("id", todo.id);

    if (error) {
      toast.error(`Update failed: ${error.message}`);
      setTodos((prev) => prev.map((t) => t.id === todo.id ? { ...t, is_completed: todo.is_completed } : t));
    } else {
      toast.success(updated ? "Marked complete ✓" : "Marked incomplete");
    }
  };

  // Delete (optimistic)
  const handleDeleteTodo = async (id: string) => {
    const prev = [...todos];
    setTodos((p) => p.filter((t) => t.id !== id));
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (error) {
      toast.error(`Delete failed: ${error.message}`);
      setTodos(prev);
    } else {
      toast.info("Todo deleted.");
    }
  };

  // Filtered list
  const filtered = todos.filter((t) => {
    if (!showCompleted && t.is_completed) return false;
    if (filterCategory !== "all" && t.category !== filterCategory) return false;
    return true;
  });

  const pendingCount = todos.filter((t) => !t.is_completed).length;
  const overdueCount = todos.filter((t) => isOverdue(t.due_date) && !t.is_completed).length;

  const categories = (["all", "work", "personal", "urgent", "other"] as const);

  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FA", color: "#101828", padding: "48px 20px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      <SkeletonStyles />
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        {/* Nav */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <Link href="/" style={{ color: "#224F34", fontWeight: 700, textDecoration: "none", fontSize: 14 }}>
            ← Back to Home
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {user ? (
              <span style={{ fontSize: 13, background: "#C2EFD4", color: "#224F34", padding: "4px 10px", borderRadius: 20, fontWeight: 600 }}>
                {user.email}
              </span>
            ) : (
              <Link href="/auth" style={{ fontSize: 13, background: "#224F34", color: "#fff", padding: "6px 14px", borderRadius: 6, textDecoration: "none", fontWeight: 600 }}>
                Sign In →
              </Link>
            )}
          </div>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: "#224F34" }}>
            Supabase Live CRUD
          </span>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#101828", margin: "6px 0 4px" }}>My Todos</h1>
          <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#667085" }}>
            <span><strong style={{ color: "#224F34" }}>{pendingCount}</strong> pending</span>
            {overdueCount > 0 && (
              <span style={{ color: "#DC2626", fontWeight: 700 }}>⚠ {overdueCount} overdue</span>
            )}
          </div>
        </div>

        {/* Add form */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8e4", padding: "24px 28px", marginBottom: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.04)" }}>
          <form onSubmit={handleAddTodo} noValidate>
            {/* Task input */}
            <div style={{ marginBottom: 16 }}>
              <input
                id="new-todo-input"
                type="text"
                placeholder="What needs to be done?"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                disabled={submitting}
                style={{ ...inputStyle, width: "100%" }}
              />
            </div>

            {/* Row 2: category + priority + due date */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
              {/* Category picker */}
              <div style={{ display: "flex", gap: 6 }}>
                {(["work", "personal", "urgent", "other"] as TodoCategory[]).map((cat) => {
                  const m = CATEGORY_META[cat];
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewCategory(cat)}
                      title={m.label}
                      style={{
                        padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
                        border: `2px solid ${newCategory === cat ? m.color : "#e2e8e4"}`,
                        background: newCategory === cat ? m.bg : "transparent",
                        color: newCategory === cat ? m.color : "#667085",
                        fontSize: 13, fontWeight: 600, transition: "all 0.15s",
                      }}
                    >
                      {m.emoji} {m.label}
                    </button>
                  );
                })}
              </div>

              {/* Priority */}
              <select
                id="new-todo-priority"
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as TodoPriority)}
                style={{ ...inputStyle, padding: "7px 12px", cursor: "pointer" }}
              >
                <option value="low">↓ Low</option>
                <option value="medium">→ Medium</option>
                <option value="high">↑ High</option>
              </select>

              {/* Due date */}
              <input
                id="new-todo-due"
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="add-todo-btn"
              disabled={submitting || !newTask.trim()}
              style={{
                padding: "11px 24px", background: "#224F34", color: "#fff",
                border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14,
                cursor: submitting || !newTask.trim() ? "not-allowed" : "pointer",
                opacity: submitting || !newTask.trim() ? 0.7 : 1, fontFamily: "inherit",
                transition: "all 0.2s",
              }}
            >
              {submitting ? "Adding…" : "+ Add Todo"}
            </button>
          </form>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          {categories.map((cat) => {
            const m = cat === "all" ? null : CATEGORY_META[cat];
            const active = filterCategory === cat;
            return (
              <button
                key={cat}
                id={`filter-${cat}`}
                onClick={() => setFilterCategory(cat)}
                style={{
                  padding: "5px 14px", borderRadius: 20, cursor: "pointer", fontFamily: "inherit",
                  border: `1.5px solid ${active ? (m?.color ?? "#224F34") : "#e2e8e4"}`,
                  background: active ? (m?.bg ?? "#C2EFD4") : "transparent",
                  color: active ? (m?.color ?? "#224F34") : "#667085",
                  fontSize: 12, fontWeight: 600, transition: "all 0.15s",
                }}
              >
                {m ? `${m.emoji} ${m.label}` : "All"}
              </button>
            );
          })}
          <button
            id="toggle-completed"
            onClick={() => setShowCompleted((p) => !p)}
            style={{
              padding: "5px 14px", borderRadius: 20, cursor: "pointer", fontFamily: "inherit",
              border: "1.5px solid #e2e8e4", background: "transparent", color: "#667085",
              fontSize: 12, fontWeight: 600, marginLeft: "auto",
            }}
          >
            {showCompleted ? "Hide" : "Show"} completed
          </button>
        </div>

        {/* Main card */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8e4", padding: "20px 24px", boxShadow: "0 4px 16px rgba(0,0,0,0.04)" }}>
          {/* Loading skeletons */}
          {loading && (
            <div>
              {[1, 2, 3, 4].map((i) => <TodoSkeleton key={i} />)}
            </div>
          )}

          {/* Empty state */}
          {!loading && todos.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 20px", color: "#667085", border: "1.5px dashed #e2e8e4", borderRadius: 12 }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
              <p style={{ fontWeight: 600, margin: "0 0 4px" }}>No todos yet</p>
              <p style={{ fontSize: 13, margin: 0 }}>Add your first task above!</p>
            </div>
          )}

          {/* Filtered empty */}
          {!loading && todos.length > 0 && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "32px", color: "#667085" }}>
              <p style={{ margin: 0 }}>No todos in this filter.</p>
            </div>
          )}

          {/* Todo items */}
          {!loading && filtered.length > 0 && (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {filtered.map((todo) => {
                const overdue = isOverdue(todo.due_date) && !todo.is_completed;
                const catMeta = CATEGORY_META[todo.category ?? "other"];
                const priMeta = PRIORITY_META[todo.priority ?? "medium"];
                return (
                  <li
                    key={todo.id}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 0",
                      borderBottom: "1px solid #f0f4f1",
                    }}
                  >
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={todo.is_completed}
                      onChange={() => handleToggleComplete(todo)}
                      style={{ width: 18, height: 18, accentColor: "#224F34", cursor: "pointer", marginTop: 2, flexShrink: 0 }}
                    />

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{
                        fontSize: 15, color: todo.is_completed ? "#9ca3af" : "#101828",
                        textDecoration: todo.is_completed ? "line-through" : "none",
                        wordBreak: "break-word", display: "block",
                      }}>
                        {todo.task}
                      </span>
                      {/* Meta row */}
                      <div style={{ display: "flex", gap: 8, marginTop: 5, flexWrap: "wrap", alignItems: "center" }}>
                        {/* Category badge */}
                        <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: catMeta.bg, color: catMeta.color, fontWeight: 700 }}>
                          {catMeta.emoji} {catMeta.label}
                        </span>
                        {/* Priority */}
                        <span style={{ fontSize: 11, fontWeight: 700, color: priMeta.color }}>
                          {priMeta.label}
                        </span>
                        {/* Due date */}
                        {todo.due_date && (
                          <span style={{
                            fontSize: 11, padding: "2px 8px", borderRadius: 20, fontWeight: 600,
                            background: overdue ? "#FEF2F2" : "#F0FDF4",
                            color: overdue ? "#DC2626" : "#059669",
                          }}>
                            {overdue ? "⚠ Overdue · " : "📅 "}{formatDate(todo.due_date)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      aria-label="Delete todo"
                      style={{ background: "transparent", border: "none", color: "#d0d5dd", cursor: "pointer", fontSize: 18, padding: "2px 6px", borderRadius: 4, flexShrink: 0, transition: "color 0.15s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#dc2626")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#d0d5dd")}
                    >
                      ×
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Refresh */}
          {!loading && (
            <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
              <button
                id="refresh-todos-btn"
                onClick={loadData}
                style={{ background: "transparent", border: "1px solid #d1d5db", borderRadius: 6, padding: "5px 12px", fontSize: 13, cursor: "pointer", color: "#4b5563", fontFamily: "inherit" }}
              >
                ↻ Refresh
              </button>
            </div>
          )}
        </div>

        {/* Info card */}
        <div style={{ marginTop: 24, background: "#fff", borderRadius: 14, border: "1px solid #e2e8e4", padding: "20px 24px" }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: "#224F34", margin: "0 0 8px" }}>Schema Quick Reference</h2>
          <p style={{ fontSize: 13, color: "#667085", lineHeight: 1.6, margin: "0 0 8px" }}>
            Run migrations in <code>backend/migrations/</code> via your <strong>Supabase Dashboard → SQL Editor</strong>.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/clients" style={{ fontSize: 13, color: "#224F34", fontWeight: 600, textDecoration: "none", border: "1px solid #C2EFD4", padding: "5px 12px", borderRadius: 8, background: "#ECFDF5" }}>
              → Client Database
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

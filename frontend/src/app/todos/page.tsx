"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";

interface Todo {
  id: string;
  task: string;
  is_completed: boolean;
  created_at: string;
  user_id?: string | null;
}

export default function TodosPage() {
  const supabase = createClient();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [newTask, setNewTask] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Check auth and fetch todos
  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    // 1. Check current authenticated user
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    setUser(currentUser);

    // 2. Fetch todos
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setTodos(data || []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Add a new todo
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    setSubmitting(true);
    setErrorMessage(null);
    setStatusMessage(null);

    const todoPayload: { task: string; is_completed: boolean; user_id?: string } = {
      task: newTask.trim(),
      is_completed: false,
    };

    if (user?.id) {
      todoPayload.user_id = user.id;
    }

    const { data, error } = await supabase
      .from("todos")
      .insert(todoPayload)
      .select()
      .single();

    if (error) {
      setErrorMessage(error.message);
    } else if (data) {
      setTodos((prev) => [data, ...prev]);
      setNewTask("");
      setStatusMessage("Todo added successfully!");
      setTimeout(() => setStatusMessage(null), 3000);
    }
    setSubmitting(false);
  };

  // Toggle todo completion
  const handleToggleComplete = async (todo: Todo) => {
    const updatedStatus = !todo.is_completed;
    // Optimistic UI update
    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? { ...t, is_completed: updatedStatus } : t))
    );

    const { error } = await supabase
      .from("todos")
      .update({ is_completed: updatedStatus })
      .eq("id", todo.id);

    if (error) {
      setErrorMessage(`Failed to update: ${error.message}`);
      // Revert optimistic update
      setTodos((prev) =>
        prev.map((t) => (t.id === todo.id ? { ...t, is_completed: todo.is_completed } : t))
      );
    }
  };

  // Delete a todo
  const handleDeleteTodo = async (id: string) => {
    // Optimistic delete
    const previousTodos = [...todos];
    setTodos((prev) => prev.filter((t) => t.id !== id));

    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      setErrorMessage(`Failed to delete: ${error.message}`);
      setTodos(previousTodos);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FA", color: "#101828", padding: "48px 20px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        
        {/* Navigation & Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <Link href="/" style={{ color: "#224F34", fontWeight: 700, textDecoration: "none", fontSize: 14 }}>
            ← Back to Home
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {user ? (
              <span style={{ fontSize: 13, background: "#C2EFD4", color: "#224F34", padding: "4px 10px", borderRadius: 20, fontWeight: 600 }}>
                Logged in: {user.email}
              </span>
            ) : (
              <Link
                href="/auth"
                style={{
                  fontSize: 13,
                  background: "#224F34",
                  color: "#ffffff",
                  padding: "6px 14px",
                  borderRadius: 6,
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Sign In to Test RLS →
              </Link>
            )}
          </div>
        </div>

        {/* Main Card */}
        <div style={{ background: "#ffffff", borderRadius: 16, border: "1px solid #e2e8e4", padding: "32px", boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}>
          <div style={{ marginBottom: 24 }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: "#224F34", display: "block", marginBottom: 6 }}>
              Supabase Live CRUD
            </span>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#101828", margin: 0 }}>
              Todos & RLS Demo
            </h1>
            <p style={{ color: "#667085", fontSize: 14, marginTop: 6 }}>
              Directly connected to your Supabase project with real-time insertions, updates, and Row Level Security.
            </p>
          </div>

          {/* Alert messages */}
          {errorMessage && (
            <div style={{ padding: "14px 18px", background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 10, color: "#991B1B", fontSize: 14, marginBottom: 20 }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>Supabase Error</div>
              <div>{errorMessage}</div>
              {errorMessage.includes("relation \"public.todos\" does not exist") && (
                <div style={{ marginTop: 8, fontSize: 13, color: "#7F1D1D" }}>
                  💡 <strong>Tip:</strong> Run the migration in <code>backend/migrations/02_todos_table.sql</code> in your Supabase SQL Editor.
                </div>
              )}
            </div>
          )}

          {statusMessage && (
            <div style={{ padding: "12px 18px", background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 10, color: "#065F46", fontSize: 14, marginBottom: 20 }}>
              {statusMessage}
            </div>
          )}

          {/* Form to Add Todo */}
          <form onSubmit={handleAddTodo} style={{ display: "flex", gap: 10, marginBottom: 28 }}>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              disabled={submitting}
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: 8,
                border: "1.5px solid #d0d5dd",
                fontSize: 15,
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={submitting || !newTask.trim()}
              style={{
                padding: "12px 22px",
                background: "#224F34",
                color: "#ffffff",
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 15,
                cursor: submitting || !newTask.trim() ? "not-allowed" : "pointer",
                opacity: submitting || !newTask.trim() ? 0.7 : 1,
              }}
            >
              {submitting ? "Adding..." : "Add Todo"}
            </button>
          </form>

          {/* Todo List */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#667085" }}>
              Loading todos from Supabase...
            </div>
          ) : todos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#667085", border: "1.5px dashed #e2e8e4", borderRadius: 12 }}>
              <p style={{ margin: 0, fontWeight: 500 }}>No todos yet.</p>
              <p style={{ margin: "4px 0 0", fontSize: 13 }}>Add your first task above to test your Supabase database!</p>
            </div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 18px",
                    borderRadius: 10,
                    border: "1px solid #e5e7eb",
                    background: todo.is_completed ? "#F9FAFB" : "#ffffff",
                    transition: "all 0.2s ease",
                  }}
                >
                  <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", flex: 1 }}>
                    <input
                      type="checkbox"
                      checked={todo.is_completed}
                      onChange={() => handleToggleComplete(todo)}
                      style={{ width: 18, height: 18, accentColor: "#224F34", cursor: "pointer" }}
                    />
                    <span
                      style={{
                        fontSize: 15,
                        color: todo.is_completed ? "#9ca3af" : "#111827",
                        textDecoration: todo.is_completed ? "line-through" : "none",
                        wordBreak: "break-word",
                      }}
                    >
                      {todo.task}
                    </span>
                  </label>

                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    aria-label="Delete todo"
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#9ca3af",
                      cursor: "pointer",
                      fontSize: 18,
                      padding: "4px 8px",
                      borderRadius: 4,
                      lineHeight: 1,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#dc2626")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Quick Refresh Button */}
          <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={loadData}
              disabled={loading}
              style={{
                background: "transparent",
                border: "1px solid #d1d5db",
                borderRadius: 6,
                padding: "6px 12px",
                fontSize: 13,
                cursor: "pointer",
                color: "#4b5563",
              }}
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* Database & RLS Setup Instructions Card */}
        <div style={{ marginTop: 28, background: "#ffffff", borderRadius: 16, border: "1px solid #e2e8e4", padding: "24px 28px" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#224F34", margin: "0 0 10px" }}>
            Schema & RLS Quick Reference
          </h2>
          <p style={{ fontSize: 13, color: "#667085", lineHeight: 1.6, margin: "0 0 12px" }}>
            The SQL migration has been created in <code>backend/migrations/02_todos_table.sql</code>.
            If your table is not created yet, copy the script and execute it in your <strong>Supabase Dashboard → SQL Editor</strong>.
          </p>
          <pre
            style={{
              background: "#1e293b",
              color: "#e2e8f0",
              padding: "16px",
              borderRadius: 8,
              fontSize: 12,
              overflowX: "auto",
              lineHeight: 1.5,
            }}
          >{`CREATE TABLE IF NOT EXISTS public.todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    task TEXT NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own todos"
    ON public.todos FOR ALL
    TO authenticated
    USING ((SELECT auth.uid()) = user_id)
    WITH CHECK ((SELECT auth.uid()) = user_id);`}</pre>
        </div>

      </div>
    </div>
  );
}

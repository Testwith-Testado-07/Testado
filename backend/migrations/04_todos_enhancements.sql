-- ============================================================================
-- Migration: Enhance Todos Table (Path B — Due Dates & Categories)
-- Description: Adds due_date, category, and priority to todos.
-- ============================================================================

-- 1. Category enum
DO $$ BEGIN
    CREATE TYPE todo_category AS ENUM ('work', 'personal', 'urgent', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Priority enum
DO $$ BEGIN
    CREATE TYPE todo_priority AS ENUM ('low', 'medium', 'high');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Add new columns to todos
ALTER TABLE public.todos
    ADD COLUMN IF NOT EXISTS due_date   DATE,
    ADD COLUMN IF NOT EXISTS category   todo_category NOT NULL DEFAULT 'other',
    ADD COLUMN IF NOT EXISTS priority   todo_priority NOT NULL DEFAULT 'medium';

-- 4. Index for due dates (useful for "overdue" queries)
CREATE INDEX IF NOT EXISTS todos_due_date_idx ON public.todos(due_date);

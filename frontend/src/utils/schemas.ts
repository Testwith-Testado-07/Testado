import { z } from "zod";

/** ── Todo Schemas ──────────────────────────────────────── */

export const TodoCategory = z.enum(["work", "personal", "urgent", "other"]);
export const TodoPriority = z.enum(["low", "medium", "high"]);

export const CreateTodoSchema = z.object({
  task: z
    .string()
    .min(1, "Task cannot be empty.")
    .max(500, "Task must be 500 characters or fewer.")
    .trim(),
  category: TodoCategory.default("other"),
  priority: TodoPriority.default("medium"),
  due_date: z
    .string()
    .optional()
    .nullable()
    .refine(
      (v) => !v || !isNaN(Date.parse(v)),
      "Please enter a valid date."
    ),
});

export type CreateTodoInput = z.infer<typeof CreateTodoSchema>;

/** ── Client Schemas ─────────────────────────────────────── */

export const ProjectStatus = z.enum([
  "prospect",
  "active",
  "on_hold",
  "completed",
  "churned",
]);

export const CreateClientSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(200, "Name must be 200 characters or fewer.")
    .trim(),
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Please enter a valid email address.")
    .trim()
    .toLowerCase(),
  phone: z
    .string()
    .max(50, "Phone number is too long.")
    .optional()
    .nullable()
    .transform((v) => v?.trim() || null),
  company: z
    .string()
    .max(200, "Company name is too long.")
    .optional()
    .nullable()
    .transform((v) => v?.trim() || null),
  status: ProjectStatus.default("prospect"),
  notes: z
    .string()
    .max(2000, "Notes must be 2000 characters or fewer.")
    .optional()
    .nullable()
    .transform((v) => v?.trim() || null),
});

export type CreateClientInput = z.infer<typeof CreateClientSchema>;

/** ── Profile Schemas ────────────────────────────────────── */

export const UpdateProfileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(30, "Username must be 30 characters or fewer.")
    .regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers, and underscores.")
    .optional()
    .nullable(),
  bio: z
    .string()
    .max(300, "Bio must be 300 characters or fewer.")
    .optional()
    .nullable()
    .transform((v) => v?.trim() || null),
  website: z
    .string()
    .url("Please enter a valid URL (e.g. https://example.com).")
    .optional()
    .nullable()
    .or(z.literal("")),
  full_name: z
    .string()
    .max(100, "Name must be 100 characters or fewer.")
    .optional()
    .nullable()
    .transform((v) => v?.trim() || null),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

/** Helper: format Zod errors into a flat string message */
export function formatZodError(err: z.ZodError): string {
  return err.issues.map((issue: z.ZodIssue) => issue.message).join(" ");
}

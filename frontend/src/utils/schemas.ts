import { z } from "zod";

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

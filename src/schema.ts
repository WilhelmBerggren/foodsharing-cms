import { z } from "zod";

/**
 * The page content model. This is intentionally generic so a single editor
 * can drive every route: an optional hero, a list of body sections, and a
 * flag for whether to show the shared "groups" section.
 *
 * Image fields hold paths returned by the upload endpoint (e.g.
 * "/uploads/abc.png"). The plugin resolves them against the CMS base URL.
 */

export const heroButtonSchema = z.object({
  label: z.string(),
  style: z.enum(["primary", "secondary"]).default("primary"),
  // Optional in-app link (e.g. "/#/donera-mat") or external URL.
  href: z.string().optional(),
});

export const heroSchema = z.object({
  banner: z.string(), // image path
  // Each entry is rendered as its own heading line.
  headingLines: z.array(z.string()).default([]),
  subtitle: z.string().optional(),
  buttons: z.array(heroButtonSchema).default([]),
});

export const sectionSchema = z.object({
  title: z.string(),
  // Each entry is a paragraph. Empty strings render as spacing.
  text: z.array(z.string()).default([]),
  variant: z.enum(["even", "odd"]).default("even"),
  bgImage: z.string().optional(),
  bannerImg: z.string().optional(),
  hasButton: z.boolean().default(false),
  buttonText: z.string().optional(),
});

export const pageSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "slug must be lowercase letters, numbers and dashes"),
  // Page title (used for the route heading / breadcrumbs).
  title: z.string().default(""),
  hero: heroSchema.optional(),
  sections: z.array(sectionSchema).default([]),
  showGroups: z.boolean().default(false),
});

export type HeroButton = z.infer<typeof heroButtonSchema>;
export type Hero = z.infer<typeof heroSchema>;
export type Section = z.infer<typeof sectionSchema>;
export type Page = z.infer<typeof pageSchema>;

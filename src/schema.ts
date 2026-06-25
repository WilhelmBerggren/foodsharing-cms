import { z } from "zod";

/**
 * Content model. There are two kinds of page:
 *
 *  - "generic" — the flexible hero + body-section model used by most pages.
 *  - "donera"  — a fixed-structure rich page (the Donera mat page) with typed
 *                sections: intro + process steps, a benefits grid, and two CTA
 *                blocks. The layout is fixed in the plugin; the CMS drives the
 *                text, button links, and the step/benefit items (incl. icons).
 *
 * Legacy generic files have no `kind` field, so we inject "generic" before
 * validating (see `pageSchema`).
 */

const slugField = z
  .string()
  .regex(/^[a-z0-9-]+$/, "slug must be lowercase letters, numbers and dashes");

// ---- Generic page ---------------------------------------------------------

export const heroButtonSchema = z.object({
  label: z.string(),
  style: z.enum(["primary", "secondary"]).default("primary"),
  href: z.string().optional(),
});

export const heroSchema = z.object({
  banner: z.string(),
  headingLines: z.array(z.string()).default([]),
  subtitle: z.string().optional(),
  buttons: z.array(heroButtonSchema).default([]),
});

export const sectionSchema = z.object({
  title: z.string(),
  text: z.array(z.string()).default([]),
  variant: z.enum(["even", "odd"]).default("even"),
  bgImage: z.string().optional(),
  bannerImg: z.string().optional(),
  hasButton: z.boolean().default(false),
  buttonText: z.string().optional(),
  buttonHref: z.string().optional(), // if set, the button is a link
});

// A "Läs mer"-style group of link cards pointing at other pages.
export const linkItemSchema = z.object({
  label: z.string().default(""),
  href: z.string().default(""),
});

export const linkSectionSchema = z.object({
  title: z.string().default(""),
  items: z.array(linkItemSchema).default([]),
});

// A logo/partner ("Drivs av" / "Sammarbetar med") group.
export const partnerItemSchema = z.object({
  logo: z.string().default(""), // image path or absolute URL
  name: z.string().default(""),
  linkLabel: z.string().default(""), // visible link text, e.g. "solikyl.se"
  url: z.string().default(""), // href
});

export const partnerSectionSchema = z.object({
  title: z.string().default(""),
  variant: z.enum(["even", "odd"]).default("even"),
  items: z.array(partnerItemSchema).default([]),
});

export const genericPageSchema = z.object({
  kind: z.literal("generic"),
  slug: slugField,
  title: z.string().default(""),
  hero: heroSchema.optional(),
  sections: z.array(sectionSchema).default([]),
  partnerSections: z.array(partnerSectionSchema).default([]),
  linkSections: z.array(linkSectionSchema).default([]),
  showGroups: z.boolean().default(false),
});

// ---- Guide (article-style) page -------------------------------------------
// A simple page with a "Tillbaka" bar, a banner image, a title and body text.
export const guidePageSchema = z.object({
  kind: z.literal("guide"),
  slug: slugField,
  title: z.string().default(""),
  banner: z.string().default(""),
  body: z.array(z.string()).default([]),
});

// ---- Contact page ---------------------------------------------------------
export const contactPageSchema = z.object({
  kind: z.literal("contact"),
  slug: slugField,
  title: z.string().default("Kontakta oss"),
  heading: z.string().default(""),
  subtitle: z.string().default(""),
  emailCard: z.object({
    heading: z.string().default(""),
    email: z.string().default(""),
    note: z.string().default(""),
  }),
  socialHeading: z.string().default(""),
});

// ---- Donera (rich, fixed-structure) page ----------------------------------

// Icons the editor can choose from. The plugin maps these names to artwork.
export const iconName = z.enum([
  "calendar",
  "apple-pail",
  "delivery-box",
  "handshake",
  "trash",
  "tree",
  "thumbs-up",
]);

const iconItemSchema = z.object({
  icon: iconName,
  text: z.string(),
});

const ctaSchema = z.object({
  title: z.string(),
  text: z.string().default(""),
  buttonLabel: z.string().default(""),
  buttonHref: z.string().default(""),
});

export const doneraPageSchema = z.object({
  kind: z.literal("donera"),
  slug: slugField,
  title: z.string().default("Donera mat"),
  hero: z.object({
    title: z.string(),
    subtitle: z.string().default(""),
  }),
  intro: z.object({
    title: z.string(),
    paragraphs: z.array(z.string()).default([]),
    lead: z.string().default(""),
  }),
  steps: z.array(iconItemSchema).default([]),
  benefitsTitle: z.string().default(""),
  benefits: z.array(iconItemSchema).default([]),
  temporary: ctaSchema,
  contact: ctaSchema,
});

// ---- Union ----------------------------------------------------------------

export const pageSchema = z.preprocess(
  (val) =>
    val && typeof val === "object" && !("kind" in val)
      ? { ...val, kind: "generic" }
      : val,
  z.discriminatedUnion("kind", [
    genericPageSchema,
    doneraPageSchema,
    guidePageSchema,
    contactPageSchema,
  ]),
);

export type HeroButton = z.infer<typeof heroButtonSchema>;
export type Hero = z.infer<typeof heroSchema>;
export type Section = z.infer<typeof sectionSchema>;
export type PartnerItem = z.infer<typeof partnerItemSchema>;
export type PartnerSection = z.infer<typeof partnerSectionSchema>;
export type LinkItem = z.infer<typeof linkItemSchema>;
export type LinkSection = z.infer<typeof linkSectionSchema>;
export type GuidePage = z.infer<typeof guidePageSchema>;
export type ContactPage = z.infer<typeof contactPageSchema>;
export type GenericPage = z.infer<typeof genericPageSchema>;
export type DoneraPage = z.infer<typeof doneraPageSchema>;
export type Page = z.infer<typeof pageSchema>;

// Input/authoring shape: defaulted fields are optional. Used by the seed and
// savePage so callers don't have to spell out every defaulted array/flag.
export type PageInput =
  | z.input<typeof genericPageSchema>
  | z.input<typeof doneraPageSchema>
  | z.input<typeof guidePageSchema>
  | z.input<typeof contactPageSchema>;

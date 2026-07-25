import { z } from "zod";

export const journalsFilterSchema = z.object({
  area: z.string().optional(),
  group: z.string().optional(),
  source: z.string().optional(),
  rating: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(100),
});

export const journalsSearchSchema = z.object({
  q: z.string().optional().default(""),
  source: z.string().optional(),
  abdc_rating: z.string().optional(),
  ajg_rating: z.string().optional(),
  sjr_quartile: z.string().optional(),
  area: z.string().optional(),
  ajg_subject_area: z.string().optional(),
  scimago_areas: z.string().optional(),
  scopus_area_id: z.coerce.number().int().positive().optional(),
  scopus_area_group_id: z.coerce.number().int().positive().optional(),
  major_group_id: z.coerce.number().int().positive().optional(),
  area_group_id: z.coerce.number().int().positive().optional(),
  publisher: z.string().optional(),
  active_status: z.string().optional(),
  source_type: z.string().optional(),
  year_from: z.coerce.number().int().optional(),
  year_to: z.coerce.number().int().optional(),
  sort: z.string().optional().default("title"),
  order: z.enum(["asc", "desc"]).optional().default("asc"),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export const journalIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type JournalsFilterInput = z.infer<typeof journalsFilterSchema>;
export type JournalsSearchInput = z.infer<typeof journalsSearchSchema>;
export type JournalIdInput = z.infer<typeof journalIdSchema>;

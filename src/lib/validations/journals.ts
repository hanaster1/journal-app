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
  q: z.string().min(1),
  source: z.string().optional(),
  rating: z.string().optional(),
  area: z.string().optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(50),
});

export type JournalsFilterInput = z.infer<typeof journalsFilterSchema>;
export type JournalsSearchInput = z.infer<typeof journalsSearchSchema>;

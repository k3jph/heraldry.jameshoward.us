import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const traditionSchema = z.object({
  title: z.string(),
  description: z.string(),
  region: z.string(),
  languages: z.array(z.string()).min(1),
  track: z.string(),
  period: z.string(),
  sourceIds: z.array(z.string()),
  level: z.string(),
});


const achievementSchema = z.object({
  title: z.string(),
  description: z.string(),
  order: z.number().int().positive(),
  focus: z.string(),
  period: z.string(),
  sources: z.array(z.string()).min(1),
});

const seminarSchema = z.object({
  title: z.string(),
  description: z.string(),
  order: z.number().int().positive(),
  focus: z.string(),
  sourceIds: z.array(z.string()),
  level: z.string(),
});

export const collections = {
  foundation: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/foundation' }),
    schema: z.object({
      title: z.string(),
      unit: z.number().int().min(1).max(12),
      updated: z.string(),
      status: z.literal('Expanded teaching draft; specialist review pending'),
    }),
  }),
  achievement: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/achievement' }),
    schema: achievementSchema,
  }),
  seminars: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/seminars' }),
    schema: seminarSchema,
  }),
  traditions: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/traditions' }),
    schema: traditionSchema,
  }),
};


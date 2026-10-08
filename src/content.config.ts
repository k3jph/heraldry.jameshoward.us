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

export const collections = {
  traditions: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/traditions' }),
    schema: traditionSchema,
  }),
};

import { defineContentConfig, defineCollection } from "@nuxt/content";
import { z } from "zod";

export default defineContentConfig({
  collections: {
    blogs: defineCollection({
      type: "page",
      source: "blogs/**/*.md",
      schema: z.object({
        image: z.string(),
        keywords: z.string(),
        date: z.date(),
      }),
    }),
    thoughts: defineCollection({
      type: "data",
      source: "thoughts/index.yml",
      schema: z.object({
        list: z.array(
          z.object({
            title: z.string(),
            date: z.date(),
            description: z.string(),
            icon: z.string(),
          }),
        ),
      }),
    }),
  },
});

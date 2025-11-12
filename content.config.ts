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
    projects: defineCollection({
      type: "data",
      source: "projects/**/*.yml",
      schema: z.object({
        title: z.string(),
        description: z.string(),
        image: z.string(),
        links: z.array(
          z.object({
            label: z.string(),
            color: z.enum([
              "error",
              "primary",
              "secondary",
              "success",
              "info",
              "warning",
              "neutral",
            ]),
            activeColor: z.enum([
              "error",
              "primary",
              "secondary",
              "success",
              "info",
              "warning",
              "neutral",
            ]),
            variant: z.enum([
              "solid",
              "outline",
              "soft",
              "subtle",
              "ghost",
              "link",
            ]),
            activeVariant: z.enum([
              "solid",
              "outline",
              "soft",
              "subtle",
              "ghost",
              "link",
            ]),
            size: z.enum(["xs", "sm", "md", "lg", "xl"]),
            icon: z.string(),
            trailingIcon: z.string(),
            to: z.string(),
            target: z.enum(["_blank", "_parent", "_self", "_top"]),
          }),
        ),
      }),
    }),
  },
});

import { z } from "zod";

export const sumSchema = z.object({
  a: z.number().min(1).max(1000),
  b: z.number().min(1).max(1000),
});

export const multiplySchema = z.object({
  a: z.number().min(1).max(1000),
  b: z.number().min(1).max(1000),
});

export const divideSchema = z.object({
  a: z.number(),
  b: z.number(),
});

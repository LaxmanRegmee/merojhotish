// lib/env.ts
import { z } from "zod";

const EnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().url().default("file:./dev.db"),
  
  // NVIDIA API
  NVIDIA_API_KEY: z.string().min(1),
  
  // NextAuth
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url().default("http://localhost:3000"),
  
  // Upstash Redis (optional - falls back to in-memory if not set)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  
  // App
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
});

export const env = EnvSchema.parse(process.env);
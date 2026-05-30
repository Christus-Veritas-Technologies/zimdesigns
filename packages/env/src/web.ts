import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_SERVER_URL: z.url(),
  },
  server: {
    NEXTAUTH_SECRET: z.string().optional(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  emptyStringAsUndefined: true,
});

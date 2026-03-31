import { z } from "zod";

const configSchema = z.object({
  PORT: z.coerce.number().default(1234),
});

export const config = configSchema.parse(process.env);

import z from "zod";

const schema = z.object({
  PORT: z.string().min(4),
  MONGODB_USERNAME: z.string().min(4),
  MONGODB_PASSWORD: z.string().min(3),
  MONGODB_DB_NAME: z.string().min(1),
  MONGODB_URL: z.string().min(1).url(),
  JWT_PASS: z.string().min(10),
});

export const env = schema.parse(process.env);

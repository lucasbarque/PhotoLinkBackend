import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  ALLOWED_ORIGINS: z.string().default('http://localhost:5173'),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().default(3333),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  URL_FRONTEND: z.string(),
  ACTIVE_SEND_EMAILS: z.coerce.boolean().default(false),
  GOOGLE_USERS_FOLDER: z.string(),
  GOOGLE_GALLERIES_FOLDER: z.string(),
  GOOGLE_GALLERIES_COVER_FOLDER: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error('❌ Invalid environment variables', _env.error.format());

  throw new Error('Invalid environment variables.');
}

export const env = _env.data;

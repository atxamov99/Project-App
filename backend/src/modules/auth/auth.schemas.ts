import { z } from 'zod'

const emailSchema = z.string().trim().toLowerCase().email('Email noto\'g\'ri')

export const registerSchema = z.object({
  email: emailSchema,
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, 'Username kamida 3 belgi')
    .max(20, 'Username 20 belgidan oshmasin')
    .regex(/^[a-z0-9_]+$/i, 'Faqat harf, raqam va _ qabul qilinadi'),
  displayName: z.string().trim().min(1).max(50),
  password: z.string().min(8, 'Parol kamida 8 belgi bo\'lsin').max(100),
})

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
})

export const googleLoginSchema = z.object({
  idToken: z.string().min(20, 'idToken talab etiladi'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type GoogleLoginInput = z.infer<typeof googleLoginSchema>

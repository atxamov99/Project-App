import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('Email noto\'g\'ri'),
  username: z
    .string()
    .min(3, 'Username kamida 3 belgi')
    .max(20, 'Username 20 belgidan oshmasin')
    .regex(/^[a-z0-9_]+$/i, 'Faqat harf, raqam va _ qabul qilinadi'),
  displayName: z.string().min(1).max(50),
  password: z.string().min(8, 'Parol kamida 8 belgi bo\'lsin').max(100),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>

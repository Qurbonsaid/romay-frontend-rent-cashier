import { z } from 'zod'

export const addClientSchema = z.object({
  branch: z
    .string({ required_error: 'Filialni tanlang' })
    .min(1, 'Filial shart'),
  name: z.string().min(2, 'Ism kamida 2 ta belgi'),
  phone: z.string().regex(/^\+?\d[\d\s-]{7,}$/g, 'Raqam formati noto‘g‘ri'),
  password: z.string().min(4, 'Parol kamida 4 ta belgi'),
})

export type AddClientValues = z.infer<typeof addClientSchema>

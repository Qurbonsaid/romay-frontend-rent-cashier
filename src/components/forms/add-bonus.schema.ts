import { z } from 'zod'

export const addBonusTypeSchema = z.object({
  bonus_name: z.string().min(2, 'Nom kamida 2 ta belgi'),
  target_amount: z.string().min(1, 'Maqsad summa kiritilishi shart'),
  discount_amount: z.string().min(1, 'Chegirma summa kiritilishi shart'),
})

export type AddBonusTypeValues = z.infer<typeof addBonusTypeSchema>

import * as z from "zod"

export const userUpdateSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  first_name: z.string().min(2).max(50).optional(),
  last_name: z.string().min(2).max(50).optional(),
  username: z.string().min(3).max(50),
})

export type UserUpdateValues = z.infer<typeof userUpdateSchema>

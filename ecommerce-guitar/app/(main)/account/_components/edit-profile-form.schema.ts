import { z } from "zod";

export const editProfileFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
});

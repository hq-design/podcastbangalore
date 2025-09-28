import { z } from "zod";

export const availabilityQuerySchema = z.object({
  start: z.string().optional(),
  end: z.string().optional(),
});

export type AvailabilityQuery = z.infer<typeof availabilityQuerySchema>;

export const quoteSchema = z.object({
  duration: z.number().min(1).max(10),
  engineer: z.boolean().optional().default(false),
  multiCam: z.boolean().optional().default(false),
  afterHours: z.boolean().optional().default(false),
  rush: z.boolean().optional().default(false),
});

export type QuotePayload = z.infer<typeof quoteSchema>;

export const contactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().min(7).max(20).optional(),
  message: z.string().min(10).max(1500),
  preferredDate: z.string().optional(),
  preferredSlot: z.string().optional(),
  quoteSummary: z.string().optional(),
  recaptchaToken: z.string().optional(),
});

export type ContactPayload = z.infer<typeof contactSchema>;

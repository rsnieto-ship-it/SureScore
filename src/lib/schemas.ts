import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  district: z.string().min(2, "Please enter your district name"),
  role: z.string().min(1, "Please select your role"),
  interest: z.string().min(1, "Please select your primary interest"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const bookingSchema = z.object({
  studentName: z.string().min(2, "Student name is required"),
  parentName: z.string().min(2, "Parent/Guardian name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  program: z.string().min(1, "Please select a program"),
  grade: z.string().min(1, "Please select a grade level"),
  preferredTime: z.string().min(1, "Please select a preferred time"),
  notes: z.string().optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

export const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export type SubscribeFormData = z.infer<typeof subscribeSchema>;

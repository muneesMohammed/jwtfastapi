import { z } from "zod";

export const EmployeeSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Must be a valid email").optional(),
  phone: z.string().optional(),
  hire_date: z.string().date("Invalid date format").optional(),
  salary: z.number().int().positive("Must be positive").optional(),
  role_id: z.number({ required_error: "Role is required" })  // 👈 role_id now!
});
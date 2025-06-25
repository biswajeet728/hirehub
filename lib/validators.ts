import * as z from "zod";

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .min(3, { message: "Full name must be at least 3 characters" }),

    email: z.string().email({ message: "Invalid email format" }),

    phone: z
      .string()
      .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.string().email({
    message: "Invalid email format",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
});

export const jobPostingSchema = z.object({
  // Step 1: Company Info
  companyName: z.string().min(2, "Company name is required"),
  companyLogo: z
    .string({
      required_error: "Company logo is required",
    })
    .min(1, "Company logo is required"),
  aboutUs: z.string().optional(),

  // Step 2: Founding Info
  organizationType: z.string().min(1, "Organization type is required"),
  industryTypes: z
    .array(z.string())
    .min(1, "At least one industry type is required"),
  teamSize: z.string().min(1, "Team size is required"),
  yearOfEstablishment: z
    .union([z.date(), z.string().transform((str) => new Date(str))])
    .optional(),
  companyWebsite: z
    .string()
    .min(1, "Company website is required")
    .url("Please enter a valid URL"),
  companyVision: z.string().optional(),

  // Step 3: Social Media
  socialMediaProfiles: z
    .array(
      z.object({
        platform: z.string().min(1, "Platform is required"),
        url: z
          .string()
          .url("Please enter a valid URL")
          .min(1, "URL is required"),
      })
    )
    .min(1, "At least one social media profile is required"),

  // Step 4: Contact Info
  mapLocation: z.string().min(1, "Office address is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z
    .string()
    .email("Please enter a valid email")
    .min(1, "Email is required"),
});

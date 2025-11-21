import { z } from 'zod';

// User validation schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  name: z.string().min(1, 'Name is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

// Website visit validation schema
export const websiteVisitSchema = z.object({
  url: z.string().url('Invalid URL format').min(1, 'URL is required'),
  referrer: z.string().optional(),
  user_agent: z.string().optional(),
  ip_address: z.string().optional(),
});

// Newsletter/Blog subscription validation schema
export const newsletterBlogSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  name: z.string().optional(),
  subscribed_at: z.date().optional(),
});

// Type inference for form data
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type WebsiteVisitFormData = z.infer<typeof websiteVisitSchema>;
export type NewsletterBlogFormData = z.infer<typeof newsletterBlogSchema>;

// Utility function to validate and format errors
export const validateFormData = async <T>(schema: z.ZodSchema<T>, data: unknown) => {
  try {
    const validatedData = await schema.parseAsync(data);
    return { success: true, data: validatedData, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.reduce((acc, curr) => {
        const fieldName = curr.path[0] || 'unknown';
        acc[fieldName] = curr.message;
        return acc;
      }, {} as Record<string, string>);

      return { success: false, data: null, errors };
    }

    return { 
      success: false, 
      data: null, 
      errors: { general: 'An unexpected error occurred' } 
    };
  }
};
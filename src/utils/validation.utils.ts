import { z } from 'zod';
import { UserRole } from '../types/domain/user.types';
import { MetricType, MeasurementUnit } from '../types/domain/metrics.types';

// ============================================================================
// COMMON VALIDATION SCHEMAS
// ============================================================================

export const IdSchema = z.string().min(1, 'ID is required');

export const TimestampSchema = z.date().or(z.string().transform((str) => new Date(str)));

export const PaginationSchema = z.object({
  page: z.number().min(1, 'Page must be at least 1'),
  limit: z.number().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100'),
  total: z.number().min(0, 'Total must be non-negative').optional(),
});

// ============================================================================
// USER VALIDATION SCHEMAS
// ============================================================================

export const UserRoleSchema = z.nativeEnum(UserRole);

export const CreateUserSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .max(255, 'Email must be less than 255 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  role: UserRoleSchema.optional().default(UserRole.VIEWER),
});

export const UpdateUserSchema = CreateUserSchema.partial().omit({ password: true });

export const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters')
    .max(128, 'New password must be less than 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'New password must contain at least one lowercase letter, one uppercase letter, and one number'),
});

export const UserSchema = z.object({
  id: IdSchema,
  email: z.string().email(),
  name: z.string(),
  role: UserRoleSchema,
  createdAt: TimestampSchema.optional(),
  lastLogin: TimestampSchema.nullable().optional(),
});

// ============================================================================
// METRICS VALIDATION SCHEMAS
// ============================================================================

export const MetricTypeSchema = z.nativeEnum(MetricType);

export const MeasurementUnitSchema = z.nativeEnum(MeasurementUnit);

export const CreateMetricSchema = z.object({
  name: z
    .string()
    .min(1, 'Metric name is required')
    .max(100, 'Metric name must be less than 100 characters'),
  type: MetricTypeSchema,
  unit: MeasurementUnitSchema,
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  value: z.number().finite('Value must be a valid number'),
});

export const UpdateMetricSchema = CreateMetricSchema.partial();

export const MetricValueSchema = z.object({
  value: z.number().finite('Value must be a valid number'),
  timestamp: TimestampSchema.default(() => new Date()),
  quality: z.object({
    isValid: z.boolean(),
    confidence: z.number().min(0).max(1),
    source: z.string(),
  }).optional(),
});

export const CreateMetricValueSchema = MetricValueSchema.omit({ timestamp: true }).extend({
  metricId: IdSchema,
  timestamp: TimestampSchema.optional(),
});

export const MetricDataSchema = z.object({
  id: IdSchema,
  name: z.string(),
  type: MetricTypeSchema,
  unit: MeasurementUnitSchema,
  description: z.string().optional(),
  value: z.number(),
  timestamp: TimestampSchema,
  quality: z.object({
    isValid: z.boolean(),
    confidence: z.number().min(0).max(1),
    source: z.string(),
  }).optional(),
});

// ============================================================================
// API RESPONSE VALIDATION SCHEMAS
// ============================================================================

export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.string(), z.unknown()).optional(),
  timestamp: TimestampSchema,
});

export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    message: z.string().optional(),
    timestamp: TimestampSchema,
  });

export const ApiErrorResponseSchema = z.object({
  success: z.literal(false),
  error: ApiErrorSchema,
  timestamp: TimestampSchema,
});

export const PaginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
  ApiResponseSchema(z.object({
    items: z.array(itemSchema),
    pagination: PaginationSchema,
  }));

// ============================================================================
// AUTHENTICATION VALIDATION SCHEMAS
// ============================================================================

export const TokenPayloadSchema = z.object({
  sub: IdSchema, // user ID
  email: z.string().email(),
  role: UserRoleSchema,
  iat: z.number(),
  exp: z.number(),
});

export const AuthResponseSchema = ApiResponseSchema(z.object({
  user: UserSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
}));

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// ============================================================================
// FORM VALIDATION SCHEMAS
// ============================================================================

export const ContactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email format'),
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be less than 200 characters'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
});

export const SearchSchema = z.object({
  query: z
    .string()
    .min(1, 'Search query is required')
    .max(100, 'Search query must be less than 100 characters'),
  filters: z.record(z.string(), z.unknown()).optional(),
  sort: z.object({
    field: z.string(),
    direction: z.enum(['asc', 'desc']),
  }).optional(),
  pagination: PaginationSchema.partial().optional(),
});

// ============================================================================
// VALIDATION UTILITY FUNCTIONS
// ============================================================================

/**
 * Safely parse data with a Zod schema, returning a Result type
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  return result.success
    ? { success: true, data: result.data }
    : { success: false, error: result.error };
}

/**
 * Create a validation function that returns a Result type
 */
export function createValidator<T>(schema: z.ZodSchema<T>) {
  return (data: unknown) => safeValidate(schema, data);
}

/**
 * Transform Zod errors into user-friendly messages
 */
export function formatValidationErrors(error: z.ZodError): string[] {
  return error.issues.map((err: z.ZodIssue) => {
    const path = err.path.join('.');
    return path ? `${path}: ${err.message}` : err.message;
  });
}

/**
 * Get the first validation error message
 */
export function getFirstValidationError(error: z.ZodError): string {
  const errors = formatValidationErrors(error);
  return errors[0] || 'Validation failed';
}

/**
 * Validate and transform form data
 */
export function validateFormData<T>(
  schema: z.ZodSchema<T>,
  formData: FormData
): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const data = Object.fromEntries(formData.entries());
    const result = safeValidate(schema, data);
    
    if (result.success) {
      return { success: true, data: result.data };
    } else {
      return { 
        success: false, 
        errors: formatValidationErrors(result.error) 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      errors: ['Invalid form data format'] 
    };
  }
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type CreateMetricInput = z.infer<typeof CreateMetricSchema>;
export type UpdateMetricInput = z.infer<typeof UpdateMetricSchema>;
export type CreateMetricValueInput = z.infer<typeof CreateMetricValueSchema>;
export type ContactFormInput = z.infer<typeof ContactFormSchema>;
export type SearchInput = z.infer<typeof SearchSchema>;
export type TokenPayload = z.infer<typeof TokenPayloadSchema>;
export type ApiError = z.infer<typeof ApiErrorSchema>;
export type PaginationData = z.infer<typeof PaginationSchema>;
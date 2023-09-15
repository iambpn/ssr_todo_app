import { ZodError, ZodObject, ZodType } from "zod";

export function validateZod<T>(schema: ZodType<T>, data: Record<string, any>) {
  try {
    const parsed = schema.parse(data);
    return { parsed, isError: false };
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return { errors: error.format() as Record<string, any>, isError: true };
    }
    throw error;
  }
}

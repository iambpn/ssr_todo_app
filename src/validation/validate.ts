import { ZodError, ZodObject, ZodType } from "zod";

type validateReturnType<T> = { parsed: T; isError: false } | { errors: Record<string, any>; isError: true };

export function validateZod<T>(schema: ZodType<T>, data: Record<string, any>): validateReturnType<T> {
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

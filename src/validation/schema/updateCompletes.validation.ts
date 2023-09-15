import { z } from "zod";

export const updateCompletedStatusSchema = z.object({
  id: z.string({
    required_error: "id is required",
  }),
});

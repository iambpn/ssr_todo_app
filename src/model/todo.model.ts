import mongoose from "mongoose";
const { Schema } = mongoose;

interface TodoDoc {
  name: string;
  description: string;
  is_completed: boolean;
  scheduled_date: Date;
  created_at: Date;
}

const TodoSchema = new Schema<TodoDoc>({
  name: String,
  description: String,
  is_completed: { type: Boolean, default: false },
  /* schedule date will be in users timezone. */
  scheduled_date: { type: Date, required: true },
  /* created at will be in UTC timezone */
  created_at: { type: Date, default: Date.now },
});

export const TodoModel = mongoose.model<TodoDoc>("Todo", TodoSchema);

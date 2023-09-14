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
  is_completed: Boolean,
  scheduled_date: { type: Date, required: true },
  created_at: { type: Date, default: Date.now },
});

const TodoModel = mongoose.model<TodoDoc>("Todo", TodoSchema);

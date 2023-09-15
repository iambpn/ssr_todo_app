import { Request, Response, Router } from "express";
import { validateZod } from "../validation/validate";
import { addTodoValidation } from "../validation/schema/addTodo.validation";
import { TodoModel } from "../model/todo.model";
import { updateCompletedStatusSchema } from "../validation/schema/updateCompletes.validation";
import mongoose from "mongoose";

export const indexRouter = Router();

indexRouter.get("/", async (req: Request, res: Response) => {
  const todos = await TodoModel.find().sort({ scheduled_date: 1 }).exec();
  res.render("body/index", { todos });
});

indexRouter.get("/add", (req: Request, res: Response) => {
  res.render("body/addTodo", {});
});

indexRouter.post("/add", async (req: Request, res: Response) => {
  const { parsed: body, isError, errors } = validateZod(addTodoValidation, req.body);

  if (isError) {
    //handle error
    return res.render("body/addTodo", { errors, values: req.body });
  }

  const todoItem = new TodoModel({
    description: body?.description,
    name: body?.name,
    scheduled_date: body?.scheduled_date,
  });

  await todoItem.save();

  return res.redirect("/");
});

indexRouter.put("/toggleUpdate", async (req: Request, res: Response) => {
  const { parsed: body, isError, errors } = validateZod(updateCompletedStatusSchema, req.body);

  if (isError) {
    return res.status(400).json({
      error: errors?.id?._errors[0] ?? errors?._errors,
    });
  }

  if (!mongoose.Types.ObjectId.isValid(body!.id)) {
    return res.status(400).json({
      error: "Invalid id",
    });
  }

  const todo = await TodoModel.findOne({
    _id: body?.id,
  }).exec();

  if (!todo) {
    return res.status(400).json({
      error: "Todo not found.",
    });
  }

  todo.is_completed = !todo.is_completed;
  await todo.save();

  res.status(200).json({
    message: "success",
  });
});

//todo update, delete, search

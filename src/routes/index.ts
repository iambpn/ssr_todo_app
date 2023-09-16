import { NextFunction, Request, Response, Router } from "express";
import mongoose from "mongoose";
import { parseToIsoDate, parseToReadableDate } from "../helper/date.helper";
import { TodoModel } from "../model/todo.model";
import { addTodoValidation } from "../validation/schema/addTodo.validation";
import { updateCompletedStatusSchema } from "../validation/schema/updateCompletes.validation";
import { validateZod } from "../validation/validate";

export const indexRouter = Router();

indexRouter.get("/", async (req: Request, res: Response) => {
  const keyword = req.query.keyword as string | undefined;
  let isCompletedQuery = req.query.completed as string | undefined;

  let isCompleted: Boolean | undefined = undefined;
  if (isCompletedQuery !== undefined) {
    if (isCompletedQuery === "true") {
      isCompleted = true;
    } else {
      isCompleted = false;
    }
  }

  const todos = await TodoModel.find({
    name: { $regex: keyword ?? "", $options: "i" },
    ...(isCompleted !== undefined && { is_completed: isCompleted }),
    ...(isCompleted === false && { scheduled_date: { $gte: new Date() } }),
  })
    .sort({ scheduled_date: 1 })
    .exec();
  res.render("body/index", { todos, keyword, parseToReadableDate, isCompleted });
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

  return res.redirect(301, "/");
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

  const todo = await TodoModel.findById(body?.id).exec();

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

indexRouter.get("/update/:id", async (req: Request, res: Response, next: NextFunction) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new Error("Invalid Id"));
  }

  const todo = await TodoModel.findById(req.params.id).exec();

  if (!todo) {
    return next(new Error("Todo not found"));
  }

  return res.render("body/addTodo", { values: todo, parseToIsoDate });
});

indexRouter.post("/update/:id", async (req: Request, res: Response, next: NextFunction) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new Error("Invalid Id"));
  }

  const { parsed: body, isError, errors } = validateZod(addTodoValidation, req.body);

  if (isError) {
    return res.render("body/addTodo", {
      errors,
    });
  }

  const todo = await TodoModel.findById(req.params.id).exec();

  if (!todo) {
    return next(new Error("Todo not found"));
  }

  todo.name = body!.name;
  todo.description = body!.description;
  todo.scheduled_date = body!.scheduled_date;

  await todo.save();

  return res.redirect(301, "/");
});

indexRouter.delete("/delete/:id", async (req: Request, res: Response, next: NextFunction) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      errors: {
        _errors: "Invalid Id",
      },
    });
  }

  const todo = await TodoModel.findByIdAndDelete(req.params.id).exec();

  if (!todo) {
    return res.status(400).json({
      errors: {
        _errors: "Todo not found",
      },
    });
  }

  return res.json({ data: todo });
});

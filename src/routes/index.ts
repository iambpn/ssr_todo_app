import { NextFunction, Request, Response, Router } from "express";
import { parseToIsoDate, parseToReadableDate } from "../helper/date.helper";
import { addTodoValidation } from "../validation/schema/addTodo.validation";
import { updateCompletedStatusSchema } from "../validation/schema/updateCompletes.validation";
import { validateZod } from "../validation/validate";
import { db } from "../drizzle/init";
import { TodosSchema } from "../drizzle/schema";
import { and, asc, like, SQL, sql } from "drizzle-orm";
import * as uuid from "uuid";

export const indexRouter = Router();

indexRouter.get("/", async (req: Request, res: Response) => {
  const keyword = req.query.keyword as string | undefined;
  let isCompletedQuery = req.query.completed as string | undefined;

  let isCompleted: Boolean | undefined = undefined;
  let completedQuery: SQL<unknown> | undefined = undefined;
  if (isCompletedQuery !== undefined) {
    if (isCompletedQuery === "true") {
      isCompleted = true;
      completedQuery = sql`${TodosSchema.isCompleted} = true`;
    } else {
      isCompleted = false;
      completedQuery = sql`${TodosSchema.isCompleted} = false and ${
        TodosSchema.scheduledDate
      } > ${new Date().getTime()}`;
    }
  }

  const todos = await db
    .select()
    .from(TodosSchema)
    .where(and(like(TodosSchema.name, `%${keyword ?? ""}%`), completedQuery))
    .orderBy(asc(TodosSchema.scheduledDate));

  res.render("body/index", { todos, keyword, parseToReadableDate, isCompleted });
});

indexRouter.get("/add", (req: Request, res: Response) => {
  res.render("body/addTodo", {});
});

indexRouter.post("/add", async (req: Request, res: Response) => {
  const validateRes = validateZod(addTodoValidation, req.body);

  if (validateRes.isError) {
    //handle error
    const { errors } = validateRes;
    return res.render("body/addTodo", { errors, values: req.body });
  }

  const { parsed: body } = validateRes;

  await db.insert(TodosSchema).values({
    id: uuid.v4(),
    name: body.name,
    description: body.description,
    isCompleted: false,
    scheduledDate: new Date(body.scheduledDate),
  });

  return res.redirect(301, "/");
});

indexRouter.put("/toggleUpdate", async (req: Request, res: Response) => {
  const validateRes = validateZod(updateCompletedStatusSchema, req.body);

  if (validateRes.isError) {
    const { errors } = validateRes;
    return res.status(400).json({
      error: errors?.id?._errors[0] ?? errors?._errors,
    });
  }

  const { parsed: body } = validateRes;
  const [todo] = await db
    .select()
    .from(TodosSchema)
    .where(sql`${TodosSchema.id} = ${body.id}`)
    .limit(1);

  if (!todo) {
    return res.status(400).json({
      error: "Todo not found.",
    });
  }

  await db
    .update(TodosSchema)
    .set({
      isCompleted: !todo.isCompleted,
    })
    .where(sql`${TodosSchema.id} = ${body.id}`);

  res.status(200).json({
    message: "success",
  });
});

indexRouter.get("/update/:id", async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.id) {
    return next(new Error("Invalid Id"));
  }

  const [todo] = await db
    .select()
    .from(TodosSchema)
    .where(sql`${TodosSchema.id} = ${req.params.id}`)
    .limit(1);

  if (!todo) {
    return next(new Error("Todo not found"));
  }

  return res.render("body/addTodo", { values: todo, parseToIsoDate });
});

indexRouter.post("/update/:id", async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.id) {
    return next(new Error("Invalid Id"));
  }

  const validateRes = validateZod(addTodoValidation, req.body);

  if (validateRes.isError) {
    const { errors } = validateRes;
    return res.render("body/addTodo", {
      errors,
      values: { ...req.body, id: req.params.id },
    });
  }

  const { parsed: body } = validateRes;
  const [todo] = await db
    .select()
    .from(TodosSchema)
    .where(sql`${TodosSchema.id} = ${req.params.id}`)
    .limit(1);

  if (!todo) {
    return next(new Error("Todo not found"));
  }

  await db
    .update(TodosSchema)
    .set({
      name: body.name,
      description: body.description,
      scheduledDate: new Date(body.scheduledDate),
    })
    .where(sql`${TodosSchema.id} = ${req.params.id}`);

  return res.redirect(301, "/");
});

indexRouter.delete("/delete/:id", async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.id) {
    return res.status(400).json({
      errors: {
        _errors: "Invalid Id",
      },
    });
  }

  const [todo] = await db
    .select()
    .from(TodosSchema)
    .where(sql`${TodosSchema.id} = ${req.params.id}`)
    .limit(1);

  if (!todo) {
    return res.status(400).json({
      errors: {
        _errors: "Todo not found",
      },
    });
  }

  await db.delete(TodosSchema).where(sql`${TodosSchema.id} = ${req.params.id}`);

  return res.json({ data: todo });
});

import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { CategoryRouter } from "./routes/category";
import { CourseRouter } from "./routes/course";
import { ModuleRouter } from "./routes/module";
import { SectionRouter } from "./routes/section";
dotenv.config();

const app: Express = express();
const port = process.env.HTTP_PORT || 3000;

app.use(express.json());
app.use(CategoryRouter)
app.use(CourseRouter)
app.use(ModuleRouter)
app.use(SectionRouter)

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
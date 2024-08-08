import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import {
  createTaskHandler,
  listTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
} from "./controller/taskController";

import cors from "cors";

const corsOptions = {
  origin: process.env.WHITELIST_ORIGIN, // Whitelist the domains you want to allow
};

const app: Express = express();

app.use(cors(corsOptions));

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

const port = process.env.APP_PORT;

app.get("/list", async (req: Request, res: Response) => {
  //   await initTableIfNotExists();
  await listTaskHandler(req, res);
});

app.post("/create", async (req: Request, res: Response) => {
  await createTaskHandler(req, res);
});

app.post("/update", async (req: Request, res: Response) => {
  await updateTaskHandler(req, res);
});

app.post("/delete", async (req: Request, res: Response) => {
  await deleteTaskHandler(req, res);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

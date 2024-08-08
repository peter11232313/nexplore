import { Task } from "../interface/task";
import { CreateTaskResponse } from "../responses/CreateTaskResponse";
// const {GenericResponse} = require("../interface/GenericResponse");
import express, { Express, Request, Response } from "express";
import { ListTaskResponse } from "../responses/ListTaskResponse";
import { GenericResponse } from "../responses/GenericResponse";
import { UpdateTaskResponse } from "../responses/UpdateTaskResponse";
const {
  RESPONSE_STATUS_CODE_SUCCESS,
  RESPONSE_STATUS_CODE_INPUT_INCORRECT,
  RESPONSE_STATUS_CODE_INTERNAL,
  RESPONSE_MESSAGE_SUCCESS,
  RESPONSE_MESSAGE_INPUT_INCORRECT,
  RESPONSE_MESSAGE_INTERNAL,
} = require("../constant/taskConstant");
const {
  createTask,
  listTasks,
  deleteTask,
  updateTask,
} = require("../services/taskService");
const { initTableIfNotExists } = require("../database/pg");

export const createTaskHandler = async (req: Request, res: Response) => {
  const { task } = req.body || "";
  if (!task.trim()) {
    res.json(
      new GenericResponse(
        RESPONSE_STATUS_CODE_INPUT_INCORRECT,
        RESPONSE_MESSAGE_INPUT_INCORRECT,
      ),
    );
    return;
  }
  const createdTask: Task = await createTask(task);
  if (createdTask) {
    res.json(
      new CreateTaskResponse(
        RESPONSE_STATUS_CODE_SUCCESS,
        RESPONSE_MESSAGE_SUCCESS,
        createdTask,
      ),
    );
    return;
  }
  res.json(
    new GenericResponse(
      RESPONSE_STATUS_CODE_INTERNAL,
      RESPONSE_MESSAGE_INTERNAL,
    ),
  );
  return;
};

export const listTaskHandler = async (req: Request, res: Response) => {
  const tableExists = await initTableIfNotExists();
  if (tableExists) {
    const tasks: Task[] = await listTasks();
    if (tasks) {
      return res.json(
        new ListTaskResponse(
          RESPONSE_STATUS_CODE_SUCCESS,
          RESPONSE_MESSAGE_SUCCESS,
          tasks,
        ),
      );
    }
  }
  return res.json(
    new ListTaskResponse(
      RESPONSE_STATUS_CODE_INTERNAL,
      RESPONSE_MESSAGE_INTERNAL,
      [],
    ),
  );
};

export const updateTaskHandler = async (req: Request, res: Response) => {
  const { task, id }: Task = req.body;

  if (!id || !task || !id.trim() || !task.trim()) {
    return res.json(
      new GenericResponse(
        RESPONSE_STATUS_CODE_INPUT_INCORRECT,
        RESPONSE_MESSAGE_INPUT_INCORRECT,
      ),
    );
  }
  try {
    const updatedTask: Task = await updateTask(id, task);
    if (updatedTask) {
      return res.json(
        new UpdateTaskResponse(
          RESPONSE_STATUS_CODE_SUCCESS,
          RESPONSE_MESSAGE_SUCCESS,
          updatedTask,
        ),
      );
    } else {
      return res.json(
        new GenericResponse(
          RESPONSE_STATUS_CODE_INPUT_INCORRECT,
          RESPONSE_MESSAGE_INPUT_INCORRECT,
        ),
      );
    }
  } catch (err) {
    console.log("unexpected error ", err);
    return res.json(
      new GenericResponse(
        RESPONSE_STATUS_CODE_INTERNAL,
        RESPONSE_MESSAGE_INTERNAL,
      ),
    );
  }
};

export const deleteTaskHandler = async (req: Request, res: Response) => {
  try {
    const { id }: { id: String } = req.body || "";

    if (!id || !id.trim()) {
      return res.json(
        new GenericResponse(
          RESPONSE_STATUS_CODE_INPUT_INCORRECT,
          RESPONSE_MESSAGE_INPUT_INCORRECT,
        ),
      );
    }
    const isDeleted: number = await deleteTask(id);
    if (isDeleted) {
      return res.json(
        new GenericResponse(
          RESPONSE_STATUS_CODE_SUCCESS,
          RESPONSE_MESSAGE_SUCCESS,
        ),
      );
    } else {
      return res.json(
        new GenericResponse(
          RESPONSE_STATUS_CODE_INPUT_INCORRECT,
          RESPONSE_MESSAGE_INPUT_INCORRECT,
        ),
      );
    }
  } catch (err) {
    console.log("err deteced in deleteTask", err);
    return res.json(
      new GenericResponse(
        RESPONSE_STATUS_CODE_INTERNAL,
        RESPONSE_MESSAGE_INTERNAL,
      ),
    );
  }
};

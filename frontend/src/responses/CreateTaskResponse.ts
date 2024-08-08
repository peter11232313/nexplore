import { GenericResponse } from "./GenericResponse";
import { Task } from "../interface/Task";

export class CreateTaskResponse extends GenericResponse {
  task: Task;
  constructor(statusCode: string, message: string, task: Task) {
    super(statusCode, message);
    this.task = task;
  }
}

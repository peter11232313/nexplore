import { GenericResponse } from "../responses/GenericResponse";
import { Task } from "../interface/Task";

export class UpdateTaskResponse extends GenericResponse {
  task: Task;
  constructor(statusCode: string, message: string, task: Task) {
    super(statusCode, message);
    this.task = task;
  }
}

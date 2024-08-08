import { GenericResponse } from "../responses/GenericResponse";
import { Task } from "../interface/task";

export class CreateTaskResponse extends GenericResponse {
  task: Task;
  constructor(statusCode: string, message: string, task: Task) {
    super(statusCode, message);
    this.task = task;
  }
}

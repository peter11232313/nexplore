import { GenericResponse } from "../responses/GenericResponse";
import { Task } from "../interface/task";

export class ListTaskResponse extends GenericResponse {
  tasks: Task[];

  constructor(statusCode: string, message: string, tasks: Task[]) {
    super(statusCode, message);
    this.tasks = tasks;
  }
}

import { useState, useEffect } from "react";
import { Task } from "../interface/Task";
import axios from "axios";
import { Audio } from "react-loader-spinner";
import TaskItem from "./TaskItem";
import { useFormInputValidation } from "react-form-input-validation";
import TaskInputForm from "./TaskInputForm";

interface TastStatus {
  tasks: Task[];
  listLoading: boolean;
}

const TaskSection = () => {
  // const [tasks, setTasks] = useState<Task[]>([]);
  const [taskStatus, setTaskStatus] = useState<TastStatus>({
    tasks: [],
    listLoading: true,
  });

  const [createMode, setCreateMode] = useState<boolean>(false);

  const baseUrl = process.env.REACT_APP_TASK_SERVICE_BASE_URL
    ? process.env.REACT_APP_TASK_SERVICE_BASE_URL
    : "http://localhost:4000";
  const listTaskUrl = baseUrl.concat(
    process.env.REACT_APP_TASK_SERVICE_LIST_TASK
      ? process.env.REACT_APP_TASK_SERVICE_LIST_TASK
      : "/list"
  );

  const listTask = async () => {
    console.log(process.env.TASK_SERVICE_DELETE_TASK);
    try {
      const { data } = await axios.get(listTaskUrl);
      if (data) {
        console.log(
          "status code from backend is: " +
            data.statusCode +
            ", message: " +
            data.message
        );
        return data.tasks ? data.tasks : [];
      }
    } catch (err) {
      console.log("error occurred when calling list backend api: ", err);
      throw err;
    }
    return [];
  };

  const handleCreateTask = async () => {
    setCreateMode(true);
  };

  const onCreateTask = async (id: string, task: string) => {
    const newTasks = taskStatus.tasks;

    newTasks.push({ id, task });

    setTaskStatus({
      tasks: newTasks,
      listLoading: false,
    });

    setCreateMode(false);
  };

  const onDeleteTask = (id: string) => {
    setTaskStatus({
      tasks: taskStatus.tasks.filter((task) => task.id !== id),
      listLoading: false,
    });
  };

  const onUpdateTask = (id: string, task: string) => {
    let updatedTasks = taskStatus.tasks;
    for (let i = 0; i < updatedTasks.length; i++) {
      if (updatedTasks[i].id == id) {
        updatedTasks[i].task = task;
      }
    }
    setTaskStatus({
      tasks: updatedTasks,
      listLoading: false,
    });
  };

  useEffect(() => {
    listTask()
      .then((tasks) => {
        setTaskStatus({ tasks: tasks, listLoading: false });
      })
      .catch((err) => {
        console.log("error in listTask: ", err);
        setTaskStatus((prev) => ({ ...prev, listLoading: false }));
      });
  }, []);

  // useEffect(() => {}, [taskStatus]);

  return (
    <div>
      <h1>Task list</h1>{" "}
      <button onClick={handleCreateTask}>create new task</button>
      {createMode ? (
        <TaskInputForm onCreateTask={onCreateTask}></TaskInputForm>
      ) : (
        ""
      )}
      {taskStatus.listLoading ? (
        <Audio
          height="80"
          width="80"
          color="green"
          ariaLabel="three-dots-loading"
        />
      ) : (
        <div>
          <ul>
            {taskStatus.tasks.map((task) => (
              <div>
                <TaskItem
                  key={task.id}
                  task={task.task}
                  id={task.id}
                  onDeleteTask={onDeleteTask}
                  onUpdateTask={onUpdateTask}
                ></TaskItem>
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
export default TaskSection;

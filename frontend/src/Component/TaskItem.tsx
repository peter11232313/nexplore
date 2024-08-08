import { useState, useEffect } from "react";
import { Task } from "../interface/Task";
import axios from "axios";
import { UpdateTaskResponse } from "../responses/UpdateTaskResponse";
import { Audio } from "react-loader-spinner";

interface TaskProps {
  id: string;
  task: string;
  onDeleteTask: (id: string) => void;
  onUpdateTask: (id: string, task: string) => void;
}

const TaskItem = (props: TaskProps) => {
  const [editMode, setEditMode] = useState(false);
  const { id, task, onDeleteTask, onUpdateTask } = props;
  const [editedTaskStatus, setEditedTaskStatus] = useState({
    task,
    editLoading: false,
    editError: "",
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const baseUrl = process.env.REACT_APP_TASK_SERVICE_BASE_URL
    ? process.env.REACT_APP_TASK_SERVICE_BASE_URL
    : "http://localhost:4000";
  const updateTaskUrl = baseUrl.concat(
    process.env.REACT_APP_TASK_SERVICE_UPDATE_TASK
      ? process.env.REACT_APP_TASK_SERVICE_UPDATE_TASK
      : "/update"
  );

  const deleteTaskUrl = baseUrl.concat(
    process.env.REACT_APP_TASK_SERVICE_DELETE_TASK
      ? process.env.REACT_APP_TASK_SERVICE_DELETE_TASK
      : "/delete"
  );

  const handleEdit = async () => {
    if (editMode) {
      if (!editedTaskStatus.task) {
        setEditedTaskStatus((prevState) => ({
          ...prevState,
          editError: "input cannot be empty",
        }));
        return;
      }
      setEditedTaskStatus({
        task: editedTaskStatus.task,
        editLoading: true,
        editError: "",
      });
      try {
        const { data } = await axios.post(updateTaskUrl, {
          id: id.toString(),
          task: editedTaskStatus.task,
          editError: "",
        });
        const { statusCode } = data;

        if (statusCode == "200") {
          setEditedTaskStatus({
            task: data.task.task,
            editLoading: false,
            editError: "",
          });
          onUpdateTask(data.task.id, data.task.task);
        } else {
          setEditedTaskStatus((prevState) => ({
            ...prevState,
            editLoading: false,
            editError: "",
          }));
        }
      } catch (err) {
        console.log("err occurred when calling edit backend endpoint: ", err);
        setEditedTaskStatus((prevState) => ({
          ...prevState,
          editLoading: false,
          editError: "",
        }));
      } finally {
        setEditMode(false);
      }
    } else {
      // enter edit
      setEditMode(true);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const { data } = await axios.post(deleteTaskUrl, { id: id.toString() });
      // set state if successful
      if (data.statusCode == "200") {
        onDeleteTask(id);
      }
    } catch (err) {
      console.log("error occured when calling delete backend end point: ", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTaskStatus({
      task: e.target.value,
      editLoading: false,
      editError: "",
    });
  };

  return (
    <div>
      <button onClick={handleEdit}>{editMode ? "edit submit" : "edit"}</button>
      <button onClick={handleDelete}>delete</button>
      {deleteLoading ? (
        <Audio
          height="80"
          width="80"
          color="green"
          ariaLabel="three-dots-loading"
        />
      ) : (
        ""
      )}
      {editMode ? (
        <div>
          <input
            onChange={handleChange}
            defaultValue={editedTaskStatus.task}
          ></input>
          {editedTaskStatus.editError && (
            <span>{editedTaskStatus.editError}</span>
          )}
          {editedTaskStatus.editLoading && (
            <Audio
              height="80"
              width="80"
              color="green"
              ariaLabel="three-dots-loading"
            />
          )}
        </div>
      ) : (
        <div>{editedTaskStatus.task}</div>
      )}
    </div>
  );
};

export default TaskItem;

import axios from "axios";
import { useState } from "react";
import { Audio } from "react-loader-spinner";

// import './Form.css';

interface TaskInputProps {
  onCreateTask: (id: string, task: string) => Promise<void>;
}

const TaskInputForm = (props: TaskInputProps) => {
  const { onCreateTask } = props;
  const [formData, setFormData] = useState({
    task: "",
  });

  const [createLoading, setCreateLoading] = useState(false);

  const baseUrl = process.env.REACT_APP_TASK_SERVICE_BASE_URL
    ? process.env.REACT_APP_TASK_SERVICE_BASE_URL
    : "http://localhost:4000";
  const createTaskUrl = baseUrl.concat(
    process.env.REACT_APP_TASK_SERVICE_CREATE_TASK
      ? process.env.REACT_APP_TASK_SERVICE_CREATE_TASK
      : "/create"
  );

  const [errors, setErrors] = useState<{ task: string }>({ task: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    if (newErrors.task == "") {
      setCreateLoading(true);
      console.log("Form submitted successfully!");
      try {
        const { data } = await axios.post(createTaskUrl, formData);
        const { statusCode } = data;
        if (statusCode == "200") {
          const { id, task } = data.task;
          onCreateTask(id, task);
        }
      } catch (err) {
        console.log("error when calling backend creation endpoint, ", err);
      } finally {
        setCreateLoading(false);
      }
    } else {
      console.log("Form submission failed due to validation errors.");
    }
  };

  const validateForm = (data: { task: string }) => {
    const errors: { task: string } = { task: "" };

    if (!data.task.trim()) {
      errors.task = "task is required";
    }
    return errors;
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Form Validation</h2>
      {createLoading ? (
        <Audio
          height="80"
          width="80"
          color="green"
          ariaLabel="three-dots-loading"
        />
      ) : (
        ""
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label className="form-label">New Task:</label>
          <input
            className="form-input"
            type="text"
            name="task"
            value={formData.task}
            onChange={handleChange}
          />
          {errors.task && <span className="error-message">{errors.task}</span>}
        </div>
        <button className="submit-button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default TaskInputForm;

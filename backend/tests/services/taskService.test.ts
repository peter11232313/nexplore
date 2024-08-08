const {
  createTask,
  listTasks,
  updateTask,
  deleteTask,
} = require("../../src/services/taskService");
const { pool } = require("../../src/database/pg");

describe("taskService", () => {
  describe("listTask", () => {
    it("should list all tasks", async () => {
      const tasks = await listTasks();
      expect(tasks).not.toBe(null);
      expect(Array.isArray(tasks)).toBe(true);
    });
  });

  describe("createTask", () => {
    it("should create task successfully", async () => {
      const task = await createTask("new");
      expect(task.id.length).not.toBe(0);
      expect(task.task.length).not.toBe(0);
    });

    it("should create task successfully", async () => {
      const task = await createTask("new");
      expect(task.id.length).not.toBe(0);
      expect(task.task.length).not.toBe(0);
      await pool.query("delete from tasks");
    });
  });

  describe("updateTask", () => {
    it("should update task successfully", async () => {
      await pool.query("insert into tasks values('1','newTask1')");
      const updatedTask = await updateTask("1", "updatedTask1");
      expect(updatedTask.id.length).not.toBe(null);
      expect(updatedTask.task.length).not.toBe(null);
      expect(updatedTask.task).toBe("updatedTask1");
      await pool.query("delete from tasks");
    });

    it("should return null when no update is made", async () => {
      const updatedTask = await updateTask(0, "newTask");
      expect(updatedTask).toBeNull;
    });
  });

  describe("deleteTask", () => {
    it("should delete task successfully", async () => {
      await pool.query("insert into tasks values('2','newTask2')");
      const isDeleted = await deleteTask("2");
      expect(isDeleted).toBe(1);
    });

    it("should return 0 if none is deleted", async () => {
      const isDeleted = await deleteTask(0);
      expect(isDeleted).toBe(0);
    });
  });
});

afterAll(async () => {
  await pool.end();
});

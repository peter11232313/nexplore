import { mockRequest } from "jest-mock-req-res";
import {
  createTaskHandler,
  updateTaskHandler,
  listTaskHandler,
  deleteTaskHandler,
} from "../../src/controller/taskController";
import { getMockReq, getMockRes } from "@jest-mock/express";
const { pool } = require("../../src/database/pg");

describe("createTaskHandler", () => {
  it("should create a new task successfully", async () => {
    const req = getMockReq({
      body: { task: "newTask" },
    });
    const { res } = getMockRes();
    await createTaskHandler(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Successful",
        statusCode: "200",
      }),
    );
  });

  it("should be failed to create a empty string task", async () => {
    const req = getMockReq({
      body: { task: "" },
    });
    const { res } = getMockRes();
    await createTaskHandler(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Input incorrect",
        statusCode: "400",
      }),
    );
    // expect(res.json().message).toBe("Successful");
  });

  it("should be faield to create task for empty space task", async () => {
    const req = getMockReq({
      body: { task: "   " },
    });
    const { res } = getMockRes();
    await createTaskHandler(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Input incorrect",
        statusCode: "400",
      }),
    );
  });
});

describe("updateTaskHandler", () => {
  it("should update a new task successfully", async () => {
    await pool.query("insert into tasks values('10','newTask')");

    const req = getMockReq({
      body: { id: "10", task: "updatedTask" },
    });

    const { res } = getMockRes();
    await updateTaskHandler(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Successful",
        statusCode: "200",
        task: { id: 10, task: "updatedTask" },
      }),
    );
    await pool.query("delete from tasks;");
  });

  it("should be failed to update for non existing id", async () => {
    await pool.query("delete from tasks where id = 0");

    const req = getMockReq({
      body: { id: "0", task: "failedTask" },
    });
    const { res } = getMockRes();
    await updateTaskHandler(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Input incorrect",
        statusCode: "400",
      }),
    );
    // expect(res.json().message).toBe("Successful");
  });

  it("should be failed to update for null id", async () => {
    const req = getMockReq({
      body: { task: "failedTask" },
    });
    const { res } = getMockRes();
    await updateTaskHandler(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Input incorrect",
        statusCode: "400",
      }),
    );
    // expect(res.json().message).toBe("Successful");
  });
});

describe("listTaskHandler", () => {
  it("should list tasks successfully", async () => {
    await pool.query("insert into tasks values('1','newTask1')");

    await pool.query("insert into tasks values('2','newTask2')");

    await pool.query("insert into tasks values('3','newTask3')");

    const req = getMockReq({});

    const { res } = getMockRes();
    await listTaskHandler(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Successful",
        statusCode: "200",
        tasks: [
          { id: 1, task: "newTask1" },
          { id: 2, task: "newTask2" },
          { id: 3, task: "newTask3" },
        ],
      }),
    );

    await pool.query("delete from tasks;");
  });
});

describe("deleteTaskHandler", () => {
  it("should delete a new task successfully", async () => {
    await pool.query("insert into tasks values('10','newTask10')");

    const req = getMockReq({
      body: { id: "10" },
    });
    const { res } = getMockRes();
    await deleteTaskHandler(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Successful",
        statusCode: "200",
      }),
    );
    await pool.query("delete from tasks");
  });

  it("should return 400 if id is not found", async () => {
    await pool.query("delete from tasks where id = '10'");
    const req = getMockReq({ body: { id: "10" } });
    const { res } = getMockRes();
    await deleteTaskHandler(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Input incorrect",
        statusCode: "400",
      }),
    );
  });
});

afterAll(async () => {
  await pool.end();
});

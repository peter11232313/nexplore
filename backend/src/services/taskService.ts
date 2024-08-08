import { error } from "console";
import { Task } from "../interface/task";

const { pool } = require("../database/pg");
const _ = require("lodash");

export const createTask = async (task: string): Promise<Task | null> => {
  try {
    const insertQuery = "INSERT INTO tasks (task) VALUES ($1) returning *";
    const result = await pool.query(insertQuery, [task]);
    if (_.get(result, "rows") && result.rows.length > 0) {
      return result.rows[0];
    }
  } catch (err) {
    console.log("err occurred in createTask", err);
  }
  return null;
};

export const listTasks = async (): Promise<Task[] | null> => {
  try {
    const selectQuery = "SELECT * from tasks";
    const result = await pool.query(selectQuery);
    if (_.get(result, "rows")) {
      return result.rows;
    }
  } catch (err) {
    console.log("err deteced in createTask", err);
  }
  return null;
};

export const updateTask = async (id: string, task: string): Promise<Task> => {
  try {
    const updateQuery = "UPDATE tasks set task = $1 where id = $2 returning *";
    const result = await pool.query(updateQuery, [task, id]);
    if (_.get(result, "rows") && result.rows.length >= 0) {
      return result.rows.length > 0 ? result.rows[0] : null;
    } else {
      throw new Error("no db result is avaialble");
    }
  } catch (err) {
    console.log("err occurred in updateTask", err);
    throw err;
  }
};

export const deleteTask = async (id: string): Promise<number> => {
  try {
    const deleteQuery = "delete from tasks where id = $1 returning *";
    const result = await pool.query(deleteQuery, [id]);
    if (_.get(result, "rows") && result.rows.length >= 0) {
      return result.rows.length > 0 ? 1 : 0;
    } else {
      throw new Error("no db result is available");
    }
  } catch (err) {
    console.log("err occurred in deleteTask", err);
    throw err;
  }
};

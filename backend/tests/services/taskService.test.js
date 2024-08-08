"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { createTask, listTasks, updateTask, deleteTask, } = require("../../src/services/taskService");
const { pool } = require("../../src/database/pg");
describe("taskService", () => {
    describe("listTask", () => {
        it("should list all tasks", () => __awaiter(void 0, void 0, void 0, function* () {
            const tasks = yield listTasks();
            expect(tasks).not.toBe(null);
            expect(Array.isArray(tasks)).toBe(true);
        }));
    });
    describe("createTask", () => {
        it("should create task successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const task = yield createTask("new");
            expect(task.id.length).not.toBe(0);
            expect(task.task.length).not.toBe(0);
        }));
        it("should create task successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const task = yield createTask("new");
            expect(task.id.length).not.toBe(0);
            expect(task.task.length).not.toBe(0);
            yield pool.query("delete from tasks");
        }));
    });
    describe("updateTask", () => {
        it("should update task successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            yield pool.query("insert into tasks values('1','newTask1')");
            const updatedTask = yield updateTask("1", "updatedTask1");
            expect(updatedTask.id.length).not.toBe(null);
            expect(updatedTask.task.length).not.toBe(null);
            expect(updatedTask.task).toBe("updatedTask1");
            yield pool.query("delete from tasks");
        }));
        it("should return null when no update is made", () => __awaiter(void 0, void 0, void 0, function* () {
            const updatedTask = yield updateTask(0, "newTask");
            expect(updatedTask).toBeNull;
        }));
    });
    describe("deleteTask", () => {
        it("should delete task successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            yield pool.query("insert into tasks values('2','newTask2')");
            const isDeleted = yield deleteTask("2");
            expect(isDeleted).toBe(1);
        }));
        it("should return 0 if none is deleted", () => __awaiter(void 0, void 0, void 0, function* () {
            const isDeleted = yield deleteTask(0);
            expect(isDeleted).toBe(0);
        }));
    });
});
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield pool.end();
}));

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
Object.defineProperty(exports, "__esModule", { value: true });
const taskController_1 = require("../../src/controller/taskController");
const express_1 = require("@jest-mock/express");
const { pool } = require("../../src/database/pg");
describe("createTaskHandler", () => {
    it("should create a new task successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const req = (0, express_1.getMockReq)({
            body: { task: "newTask" },
        });
        const { res } = (0, express_1.getMockRes)();
        yield (0, taskController_1.createTaskHandler)(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            task: "newTask",
        }));
    }));
    it("should be failed to create a empty string task", () => __awaiter(void 0, void 0, void 0, function* () {
        const req = (0, express_1.getMockReq)({
            body: { task: "" },
        });
        const { res } = (0, express_1.getMockRes)();
        yield (0, taskController_1.createTaskHandler)(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: "Input incorrect",
            statusCode: "400",
        }));
        // expect(res.json().message).toBe("Successful");
    }));
    it("should be faield to create task for empty space task", () => __awaiter(void 0, void 0, void 0, function* () {
        const req = (0, express_1.getMockReq)({
            body: { task: "   " },
        });
        const { res } = (0, express_1.getMockRes)();
        yield (0, taskController_1.createTaskHandler)(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: "Input incorrect",
            statusCode: "400",
        }));
    }));
});
describe("updateTaskHandler", () => {
    it("should update a new task successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        yield pool.query("insert into tasks values('10','newTask')");
        const req = (0, express_1.getMockReq)({
            body: { id: "10", task: "updatedTask" },
        });
        const { res } = (0, express_1.getMockRes)();
        yield (0, taskController_1.updateTaskHandler)(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            task: "updatedTask",
        }));
        yield pool.query("delete from tasks;");
    }));
    it("should be failed to update for non existing id", () => __awaiter(void 0, void 0, void 0, function* () {
        yield pool.query("delete from tasks where id = 0");
        const req = (0, express_1.getMockReq)({
            body: { id: "0", task: "failedTask" },
        });
        const { res } = (0, express_1.getMockRes)();
        yield (0, taskController_1.updateTaskHandler)(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: "Input incorrect",
            statusCode: "400",
        }));
        // expect(res.json().message).toBe("Successful");
    }));
});
describe("listTaskHandler", () => {
    it("should list tasks successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        yield pool.query("insert into tasks values('1','newTask1')");
        yield pool.query("insert into tasks values('2','newTask2')");
        yield pool.query("insert into tasks values('3','newTask3')");
        const req = (0, express_1.getMockReq)({});
        const { res } = (0, express_1.getMockRes)();
        yield (0, taskController_1.listTaskHandler)(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: "Successful",
            statusCode: "200",
            tasks: [
                { id: 1, task: "newTask1" },
                { id: 2, task: "newTask2" },
                { id: 3, task: "newTask3" },
            ],
        }));
        yield pool.query("delete from tasks;");
    }));
});
describe("deleteTaskHandler", () => {
    it("should delete a new task successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        yield pool.query("insert into tasks values('10','newTask10')");
        const req = (0, express_1.getMockReq)({
            body: { id: "10" },
        });
        const { res } = (0, express_1.getMockRes)();
        yield (0, taskController_1.deleteTaskHandler)(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: "Successful",
            statusCode: "200",
        }));
        yield pool.query("delete from tasks");
    }));
    it("should return 400 if id is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const req = (0, express_1.getMockReq)({ body: { id: "10" } });
        const { res } = (0, express_1.getMockRes)();
        yield (0, taskController_1.deleteTaskHandler)(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: "Input incorrect",
            statusCode: "400",
        }));
    }));
});
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield pool.end();
}));

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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const math_funs_1 = require("../math-funs");
const supertest_1 = __importDefault(require("supertest"));
const __1 = require("..");
vitest_1.vi.mock("../db", () => {
    return {
        db: {
            request: {
                create: vitest_1.vi.fn(),
                delete: vitest_1.vi.fn(),
                update: vitest_1.vi.fn(),
            },
        },
    };
});
(0, vitest_1.describe)("sum", () => {
    (0, vitest_1.test)("adds 1 + 2 to equal 3", () => {
        (0, vitest_1.expect)((0, math_funs_1.sum)(1, 2)).toBe(3);
    });
    (0, vitest_1.test)("should be able to add two positive numbers", () => {
        (0, vitest_1.expect)((0, math_funs_1.sum)(3, 2)).toBe(5);
    });
    (0, vitest_1.test)("should be able to add two negative numbers", () => {
        (0, vitest_1.expect)((0, math_funs_1.sum)(-3, -12)).toBe(-15);
    });
    (0, vitest_1.test)("should be able to add two 0s", () => {
        (0, vitest_1.expect)((0, math_funs_1.sum)(0, 0)).toBe(0);
    });
});
(0, vitest_1.describe)("test http sum post endpoint", () => {
    (0, vitest_1.test)("test the post sum endpoint with 1 and 2 expect answer to be 3", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(__1.app).post("/sum").send({ a: 1, b: 2 });
        (0, vitest_1.expect)(response.body.result).toBe(3);
        (0, vitest_1.expect)(response.statusCode).toBe(200);
    }));
    (0, vitest_1.test)("test the post sum endpoint with non integer values", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(__1.app)
            .post("/sum")
            .send({ a: "helloworld", b: 2 });
        (0, vitest_1.expect)(response.statusCode).toBe(422);
    }));
    (0, vitest_1.test)("test the post sum endpoint with very large values and should return an error response", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(__1.app)
            .post("/sum")
            .send({ a: 1000000, b: 12211 });
        (0, vitest_1.expect)(response.statusCode).toBe(422);
    }));
});

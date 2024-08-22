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
const supertest_1 = __importDefault(require("supertest"));
const __1 = require("..");
// we mock an external service in unit test, assuming it would pass
vitest_1.vi.mock("../db");
(0, vitest_1.describe)("test http multiply post endpoint", () => {
    (0, vitest_1.test)("test the post multiply endpoint with 3 and 2 expect answer to be 6", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(__1.app)
            .post("/multiply")
            .send({ a: "3", b: "2" });
        (0, vitest_1.expect)(response.body.result).toBe(6);
        (0, vitest_1.expect)(response.statusCode).toBe(200);
    }));
    (0, vitest_1.test)("test the zod multiply endpoint with correct inputs expecting it to pass", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(__1.app)
            .post("/zod-multiply")
            .send({ a: 1, b: 2 });
        (0, vitest_1.expect)(response.statusCode).toBe(200);
        (0, vitest_1.expect)(response.body.result).toBe(2);
    }));
    (0, vitest_1.test)("test the zod multiply endpoint with bad inputs expecting it to fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(__1.app)
            .post("/zod-multiply")
            .send({ a: 111111, b: 321312312 });
        (0, vitest_1.expect)(response.statusCode).toBe(400);
    }));
});

"use strict";
// write a simple express server
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
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const math_funs_1 = require("./math-funs");
const db_1 = require("./db");
const zod_1 = require("zod");
exports.app = (0, express_1.default)();
const sumSchema = zod_1.z.object({
    a: zod_1.z.number().min(1).max(1000),
    b: zod_1.z.number().min(1).max(1000),
});
const multiplySchema = zod_1.z.object({
    a: zod_1.z.number().min(1).max(1000),
    b: zod_1.z.number().min(1).max(1000),
});
exports.app.use(express_1.default.json());
exports.app.get("/", (req, res) => {
    res.send("Hello World!");
});
exports.app.get("/home", (req, res) => {
    console.log("home route called");
    res.send("you accessed the home route");
});
exports.app.get("/sum", (req, res) => {
    res.send("called the sum endpoint");
});
exports.app.post("/zod-sum", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedSchema = sumSchema.safeParse(req.body);
    if (!parsedSchema.success) {
        return res.status(411).json({
            message: "incorrect inputs",
        });
    }
    console.log("parsed schema is", parsedSchema);
    const { a, b } = parsedSchema.data;
    const result = (0, math_funs_1.sum)(a, b);
    return res.status(200).json({ result });
}));
exports.app.post("/zod-multiply", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedSchema = multiplySchema.safeParse(req.body);
    if (!parsedSchema.success) {
        return res.status(411).json({
            message: "incorrect inputs",
        });
    }
    console.log("parsed schema is", parsedSchema);
    const { a, b } = parsedSchema.data;
    const result = (0, math_funs_1.multiply)(a, b);
    return res.status(200).json({ result });
}));
exports.app.post("/sum", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const a = Number(req.body.a);
    const b = Number(req.body.b);
    console.log("a", a);
    console.log("b", b);
    // Check if a and b are valid numbers
    if (isNaN(a) || isNaN(b)) {
        return res.status(422).json({
            error: "Invalid numbers provided.",
        });
    }
    if (a > 1000 || b > 1000) {
        return res.status(422).json({
            error: "Very big numbers provided.We dont deal with that big numbers",
        });
    }
    const result = (0, math_funs_1.sum)(a, b);
    yield db_1.db.request.create({
        data: {
            answer: result,
            requestType: "SUM",
        },
    });
    return res.status(200).json({ result });
}));
exports.app.post("/multiply", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const a = Number(req.body.a);
    const b = Number(req.body.b);
    console.log("a", a);
    console.log("b", b);
    // Check if a and b are valid numbers
    if (isNaN(a) || isNaN(b)) {
        return res.status(400).json({ error: "Invalid numbers provided." });
    }
    const result = (0, math_funs_1.multiply)(a, b);
    yield db_1.db.request.create({
        data: {
            answer: result,
            requestType: "MULTIPLY",
        },
    });
    return res.status(200).json({ result });
}));
exports.app.get("/hello", (req, res) => {
    res.send("Hello World!");
});

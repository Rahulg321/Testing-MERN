"use strict";
// write a simple express server
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const math_funs_1 = require("./math-funs");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.get("/", (req, res) => {
    res.send("Hello World!");
});
exports.app.get("/sum", (req, res) => {
    res.send("called the sum endpoint");
});
exports.app.post("/sum", (req, res) => {
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
    res.json({ result });
});
exports.app.post("/multiply", (req, res) => {
    const a = Number(req.body.a);
    const b = Number(req.body.b);
    console.log("a", a);
    console.log("b", b);
    // Check if a and b are valid numbers
    if (isNaN(a) || isNaN(b)) {
        return res.status(400).json({ error: "Invalid numbers provided." });
    }
    const result = (0, math_funs_1.multiply)(a, b);
    res.json({ result });
});
exports.app.get("/hello", (req, res) => {
    res.send("Hello World!");
});

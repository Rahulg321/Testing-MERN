// write a simple express server

import express from "express";
import { multiply, sum } from "./math-funs";
import { db } from "./db";

export const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/sum", (req, res) => {
  res.send("called the sum endpoint");
});

app.post("/sum", async (req, res) => {
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

  const result = sum(a, b);
  await db.request.create({
    data: {
      answer: result,
      requestType: "SUM",
    },
  });

  return res.status(200).json({ result });
});

app.post("/multiply", async (req, res) => {
  const a = Number(req.body.a);
  const b = Number(req.body.b);

  console.log("a", a);
  console.log("b", b);

  // Check if a and b are valid numbers
  if (isNaN(a) || isNaN(b)) {
    return res.status(400).json({ error: "Invalid numbers provided." });
  }

  const result = multiply(a, b);

  await db.request.create({
    data: {
      answer: result,
      requestType: "MULTIPLY",
    },
  });
  return res.status(200).json({ result });
});

app.get("/hello", (req, res) => {
  res.send("Hello World!");
});

// write a simple express server

import express, { Express } from "express";
import { divide, multiply, sum } from "./math-funs";
import { db } from "./db";
import axios from "axios";
import { z } from "zod";
import { divideSchema, multiplySchema, sumSchema } from "./schemas";

export const app: Express = express();

app.use(express.json());

app.post("/zod-sum", async (req, res) => {
  try {
    const parsedSchema = sumSchema.safeParse(req.body);

    if (!parsedSchema.success) {
      return res.status(400).json({
        message: "Invalid input: " + parsedSchema.error.message,
      });
    }

    const { a, b } = parsedSchema.data;
    const result = sum(a, b);

    await db.sum.create({
      data: { a, b, result },
    });

    await db.request.create({
      data: {
        answer: result,
        requestType: "SUM",
      },
    });

    return res.status(200).json({ result });
  } catch (error) {
    console.error("Error in /zod-sum endpoint:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Invalid input",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.post("/zod-multiply", async (req, res) => {
  try {
    const parsedSchema = multiplySchema.safeParse(req.body);

    if (!parsedSchema.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: parsedSchema.error.errors,
      });
    }

    const { a, b } = parsedSchema.data;

    const result = multiply(a, b);
    await db.request.create({
      data: {
        answer: result,
        requestType: "MULTIPLY",
      },
    });

    return res.status(200).json({ result });
  } catch (error) {
    console.error("Error in /zod-multiply endpoint:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Invalid input",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
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
  const response = await db.request.create({
    data: {
      answer: result,
      requestType: "SUM",
    },
  });

  return res.status(200).json({ result, id: response.id });
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

app.post("/zod-divide", async (req, res) => {
  const validatedFields = divideSchema.safeParse(req.body);
  console.log("Validation result:", validatedFields); // Add this line
  if (!validatedFields.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: validatedFields.error.errors,
    });
  }

  const { a, b } = validatedFields.data;

  const result = divide(a, b);

  const response = await db.request.create({
    data: {
      answer: result,
      requestType: "DIVIDE",
    },
  });

  return res
    .status(200)
    .json({ result, id: response.id, type: response.requestType });
});

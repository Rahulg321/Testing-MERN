import { describe, expect, test, it } from "vitest";
import { multiply } from "../math-funs";
import request from "supertest";
import { app } from "..";

describe("multiply", () => {
  test("multiplies 1 and 2 to equal 2", () => {
    expect(multiply(1, 2)).toBe(2);
  });
});

describe("test http multiply post endpoint", () => {
  test("test the post multiply endpoint with 3 and 2 expect answer to be 6", async () => {
    const response = await request(app)
      .post("/multiply")
      .send({ a: 3, b: 2 })
      .expect(200);

    expect(response.body.result).toBe(6);
    expect(response.statusCode).toBe(200);
  });
});

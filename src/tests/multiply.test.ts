import { describe, expect, test, it, vi } from "vitest";
import { multiply } from "../math-funs";
import request from "supertest";
import { app } from "..";

// we mock an external service in unit test, assuming it would pass
vi.mock("../db");

describe("test http multiply post endpoint", () => {
  test("test the post multiply endpoint with 3 and 2 expect answer to be 6", async () => {
    const response = await request(app)
      .post("/multiply")
      .send({ a: "3", b: "2" });

    expect(response.body.result).toBe(6);
    expect(response.statusCode).toBe(200);
  });

  test("test the zod multiply endpoint with correct inputs expecting it to pass", async () => {
    const response = await request(app)
      .post("/zod-multiply")
      .send({ a: 1, b: 2 });

    expect(response.statusCode).toBe(200);
    expect(response.body.result).toBe(2);
  });

  test("test the zod multiply endpoint with bad inputs expecting it to fail", async () => {
    const response = await request(app)
      .post("/zod-multiply")
      .send({ a: 111111, b: 321312312 });

    expect(response.statusCode).toBe(400);
  });
});

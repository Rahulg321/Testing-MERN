import { describe, expect, test, vi } from "vitest";
import { sum } from "../math-funs";
import request from "supertest";
import { app } from "..";

vi.mock("../db", () => {
  return {
    db: {
      request: {
        create: vi.fn(),
        delete: vi.fn(),
        update: vi.fn(),
      },
    },
  };
});

describe("sum", () => {
  test("adds 1 + 2 to equal 3", () => {
    expect(sum(1, 2)).toBe(3);
  });

  test("should be able to add two positive numbers", () => {
    expect(sum(3, 2)).toBe(5);
  });

  test("should be able to add two negative numbers", () => {
    expect(sum(-3, -12)).toBe(-15);
  });

  test("should be able to add two 0s", () => {
    expect(sum(0, 0)).toBe(0);
  });
});

describe("test http sum post endpoint", () => {
  test("test the post sum endpoint with 1 and 2 expect answer to be 3", async () => {
    const response = await request(app).post("/sum").send({ a: 1, b: 2 });

    expect(response.body.result).toBe(3);
    expect(response.statusCode).toBe(200);
  });

  test("test the post sum endpoint with non integer values", async () => {
    const response = await request(app)
      .post("/sum")
      .send({ a: "helloworld", b: 2 });

    expect(response.statusCode).toBe(422);
  });

  test("test the post sum endpoint with very large values and should return an error response", async () => {
    const response = await request(app)
      .post("/sum")
      .send({ a: 1000000, b: 12211 });

    expect(response.statusCode).toBe(422);
  });
});

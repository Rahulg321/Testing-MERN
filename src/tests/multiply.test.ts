import { describe, expect, test, it, vi } from "vitest";
import { multiply } from "../math-funs";
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

describe("test http multiply post endpoint", () => {
  test("test the post multiply endpoint with 3 and 2 expect answer to be 6", async () => {
    const response = await request(app)
      .post("/multiply")
      .send({ a: "3", b: "2" });

    expect(response.body.result).toBe(6);
    expect(response.statusCode).toBe(200);
  });
});

import { describe, expect, test, it, vi } from "vitest";
import { multiply } from "../math-funs";
import request from "supertest";
import { app } from "..";
import { db } from "../__mocks__/db";

// we mock an external service in unit test, assuming it would pass
vi.mock("../db");

describe("test http divide post endpoint", () => {
  test("test the post divide endpoint with 4 and 2 expect answer to be 2", async () => {
    db.request.create.mockResolvedValue({
      id: "divideId",
      answer: 2,
      requestType: "DIVIDE",
    });

    vi.spyOn(db.request, "create");

    const response = await request(app)
      .post("/zod-divide")
      .send({ a: 4, b: 2 });

    expect(db.request.create).toHaveBeenCalledWith({
      data: {
        answer: 2,
        requestType: "DIVIDE",
      },
    });

    expect(response.body.result).toBe(2);
    expect(response.body.id).toBe("divideId");
    expect(response.body.type).toBe("DIVIDE");
    expect(response.statusCode).toBe(200);
  });
});

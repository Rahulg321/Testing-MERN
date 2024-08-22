import { describe, expect, test, vi } from "vitest";
import { sum } from "../math-funs";
import request from "supertest";
import { app } from "..";
import { db } from "../__mocks__/db";

vi.mock("../db");

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
    // we are mocking the return value from db call in the case when the endpoint returns the value
    db.request.create.mockResolvedValue({
      id: "somevalueid",
      answer: 3,
      requestType: "SUM",
    });

    vi.spyOn(db.request, "create");

    const response = await request(app).post("/sum").send({ a: 1, b: 2 });

    // by doing this we are making sure that we pass the correct values to the db call in our endpoint
    expect(db.request.create).toHaveBeenCalledWith({
      data: {
        answer: 3,
        requestType: "SUM",
      },
    });

    expect(response.body.result).toBe(3);
    expect(response.body.id).toBe("somevalueid");
    expect(response.statusCode).toBe(200);
  });

  test("test the zod sum endpoint with correct inputs expecting it to pass", async () => {
    const response = await request(app).post("/zod-sum").send({ a: 1, b: 2 });

    console.log("Response body:", response.body);
    console.log("Response status:", response.statusCode);

    expect(response.statusCode).toBe(200);
    expect(response.body.result).toBe(3);
  });

  test("test the zod sum endpoint with bad inputs expecting it to fail", async () => {
    const response = await request(app)
      .post("/zod-sum")
      .send({ a: 111111, b: 111111 });

    expect(response.statusCode).toBe(400);
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

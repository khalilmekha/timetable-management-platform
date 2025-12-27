import request from "supertest";

import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "@jest/globals";

import { Server } from "@/server";

beforeAll(async () => {
  await Server.start();
});

const route = "/";

describe("", () => {
  test("It should response with Success response", async () => {
    const response = await request(Server.app).get(route);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual("welcome");
  });
});

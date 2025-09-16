//Test the fixed bugs!!
process.env.NODE_ENV = "test";

const app = require("../app");
const request = require("supertest");
const db = require("../db");
const bcrypt = require("bcrypt");
const createToken = require("../helpers/createToken");

let u1Token;
let adminToken;

beforeAll(async () => {
  // reset table to a known state
  await db.query("DELETE FROM users");

  const hashed = await bcrypt.hash("password", 1);

  // seed two users (one admin)
  await db.query(
    `INSERT INTO users (username, password, first_name, last_name, email, phone, admin)
     VALUES ('u1', $1, 'U1', 'Test', 'u1@test.com', '123', false),
            ('admin', $1, 'Admin', 'Test', 'admin@test.com', '123', true)`,
    [hashed]
  );

  u1Token = createToken("u1", false);
  adminToken = createToken("admin", true);
});

afterAll(async () => {
  await db.end();
});

describe("Auth & guards", () => {
  // TESTS BUG #3: login should NOT succeed with bad password
  test("login fails on wrong password", async () => {
    const resp = await request(app)
      .post("/auth/login")
      .send({ username: "u1", password: "nope" });
    expect(resp.statusCode).toBe(401);
  });

  // TESTS BUG #5: /users requires login (auth middleware)
  test("GET /users requires login", async () => {
    const resp = await request(app).get("/users");
    expect(resp.statusCode).toBe(401);
  });

  // TESTS BUG #6 (data exposure): list returns only basic fields
  test("GET /users returns basic list when logged in", async () => {
    const resp = await request(app)
      .get("/users")
      .send({ _token: u1Token });
    expect(resp.statusCode).toBe(200);
    expect(Array.isArray(resp.body.users)).toBe(true);
    expect(resp.body.users[0]).toHaveProperty("username");
    expect(resp.body.users[0]).toHaveProperty("first_name");
    expect(resp.body.users[0]).toHaveProperty("last_name");
    expect(resp.body.users[0]).not.toHaveProperty("email");
    expect(resp.body.users[0]).not.toHaveProperty("phone");
  });

  // TESTS BUG #5: non-admin cannot delete
  test("non-admin cannot delete", async () => {
    const resp = await request(app)
      .delete("/users/u1")
      .send({ _token: u1Token });
    expect(resp.statusCode).toBe(401);
  });

  // TESTS BUG #4: admin can delete (and route awaits the delete)
  test("admin can delete other users", async () => {
    const resp = await request(app)
      .delete("/users/u1")
      .send({ _token: adminToken });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ message: "deleted" });
  });
});
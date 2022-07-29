const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");

const helper = require("./test_helper");

const Blog = require("../models/blog");
const User = require("../models/user");

const app = require("../app");
const api = supertest(app);

describe("Refactored token middleware", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({
      username: "root",
      name: "root first",
      passwordHash,
    });

    await user.save();
  });

  test("Logging in and adding a blog success", async () => {
    const existingUser = {
      username: "root",
      password: "sekret",
    };

    const result = await api
      .post("/api/login")
      .send(existingUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const token = "bearer ".concat(result.body.token);

    const newBlog = {
      title: "Test Blog",
      author: "Super Test",
      url: "https://www.supertest.com/test-blog",
      likes: 5,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", token)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogDBStateNow = await helper.blogsInDb();
    expect(blogDBStateNow).toHaveLength(1);
  });

  test("Fail login", async () => {
    const invalidUser = {
      username: "root",
      password: "test",
    };

    await api.post("/api/login").send(invalidUser).expect(401);
  });

  test("Adding blog with invalid token", async () => {
    // Valid token with last character changed
    const invalidToken =
      "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNhbmNoZXo3IiwiaWQiOiI2Mjg0MTA0YjE3NjhmNzk2ZDg1MzY1MWIiLCJpYXQiOjE2NTI4MjIxMTh9.4VIzH1j9Va-pLGZrm8FQpNjZVvq3IfxNgIw4tVIBguB";

    const testBlog = {
      title: "Fail Blog",
      author: "Super Test",
      url: "https://www.supertest.com/test-blog",
      likes: 5,
    };

    // 401 was expected at first, but JWT will return at 400 from middleware --> JsonWebTokenError
    await api
      .post("/api/blogs")
      .set("Authorization", invalidToken)
      .send(testBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const blogDBStateNow = await helper.blogsInDb();
    expect(blogDBStateNow).toHaveLength(0);
  });
});

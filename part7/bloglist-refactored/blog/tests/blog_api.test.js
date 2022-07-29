const mongoose = require("mongoose");
const app = require("../app");
const supertest = require("supertest");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const Blog = require("../models/blog");
const helper = require("./test_helper");
const { request } = require("../app");

const api = supertest(app);

const getTokenFromLogin = async (userCredentials) => {
  const result = await api.post("/api/login").send(userCredentials);

  return "bearer ".concat(result.body.token);
};

test("returns correct amount of blog posts in JSON", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test('unique identifier property is named "id"', async () => {
  const response = await api.get("/api/blogs");

  expect(response.body[0].id).toBeDefined();
});

describe("addition of a blog", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    for (let user of helper.initialUsers) {
      await api.post("/api/users").send(user).expect(201);
    }

    const firstUserCredentials = {
      username: "apple1",
      password: "apple",
    };

    // Setting all blogs to be owned by first user
    const token = await getTokenFromLogin(firstUserCredentials);

    await Blog.deleteMany({});

    for (let blog of helper.initialBlogs) {
      await api
        .post("/api/blogs")
        .set("Authorization", token)
        .send(blog)
        .expect(201);
    }
  });

  test("successful addition to database through POST request", async () => {
    const credentials = {
      username: "apple1",
      password: "apple",
    };

    const token = await getTokenFromLogin(credentials);

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
    expect(blogDBStateNow).toHaveLength(helper.initialBlogs.length + 1);
  });

  test('missing "likes" property defaults', async () => {
    const newBlogMissingLikes = {
      title: "Test Blog",
      author: "Super Test",
      url: "https://www.supertest.com/test-blog",
    };

    const credentials = {
      username: "apple1",
      password: "apple",
    };

    const token = await getTokenFromLogin(credentials);

    const response = await api
      .post("/api/blogs")
      .set("Authorization", token)
      .send(newBlogMissingLikes)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    expect(response.body.likes).toEqual(0);
  });

  test("missing title/url returns 400 Bad Request", async () => {
    const newBlogMissingTitleUrl = {
      url: "https://www.supertest.com/test-blog",
    };

    const credentials = {
      username: "apple1",
      password: "apple",
    };

    const token = await getTokenFromLogin(credentials);

    await api
      .post("/api/blogs")
      .set("Authorization", token)
      .send(newBlogMissingTitleUrl)
      .expect(400);
  }, 100000);

  test("missing token when adding blog results in fail", async () => {
    const newBlog = {
      title: "Test Blog",
      author: "Super Test",
      url: "https://www.supertest.com/test-blog",
      likes: 5,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(401)
      .expect("Content-Type", /application\/json/);

    const blogDBStateNow = await helper.blogsInDb();
    expect(blogDBStateNow).toHaveLength(helper.initialBlogs.length);
  });
});

describe("deletion of a blog", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    for (let user of helper.initialUsers) {
      await api.post("/api/users").send(user).expect(201);
    }

    const firstUserCredentials = {
      username: "apple1",
      password: "apple",
    };

    // Setting all blogs to be owned by first user
    const token = await getTokenFromLogin(firstUserCredentials);

    await Blog.deleteMany({});

    for (let blog of helper.initialBlogs) {
      await api
        .post("/api/blogs")
        .set("Authorization", token)
        .send(blog)
        .expect(201);
    }
  });

  test("succeeds with status code 204 if id & token is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    const credentials = {
      username: "apple1",
      password: "apple",
    };

    const token = await getTokenFromLogin(credentials);

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", token)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
  });

  test("fails with no token", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    const result = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401);

    expect(result.body.error).toContain("missing");

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test("fails with invalid token", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    const invalidToken =
      "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNhbmNoZXo3IiwiaWQiOiI2Mjg0MTA0YjE3NjhmNzk2ZDg1MzY1MWIiLCJpYXQiOjE2NTI4MjIxMTh9.4VIzH1j9Va-pLGZrm8FQpNjZVvq3IfxNgIw4tVIBguB";

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", invalidToken)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test("fails with wrong user", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    const userCredentials = {
      username: "banana2",
      password: "banana",
    };

    const token = await getTokenFromLogin(userCredentials);

    const result = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", token)
      .expect(401);

    expect(result.body.error).toContain("Unauthorized");

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe("updating a blog", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    for (let user of helper.initialUsers) {
      await api.post("/api/users").send(user).expect(201);
    }

    const firstUserCredentials = {
      username: "apple1",
      password: "apple",
    };

    // Setting all blogs to be owned by first user
    const token = await getTokenFromLogin(firstUserCredentials);

    await Blog.deleteMany({});

    for (let blog of helper.initialBlogs) {
      await api
        .post("/api/blogs")
        .set("Authorization", token)
        .send(blog)
        .expect(201);
    }
  }, 100000);

  test("returns updated blog content", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    blogToUpdate.likes = 100;

    const credentials = {
      username: "apple1",
      password: "apple",
    };

    const token = await getTokenFromLogin(credentials);

    const updatedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set("Authorization", token)
      .send(blogToUpdate);

    expect(updatedBlog.body.likes).toEqual(100);
  });
});

afterAll(() => {
  mongoose.connection.close();
});

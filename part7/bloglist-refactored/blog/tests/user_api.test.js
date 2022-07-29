const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");

const helper = require("./test_helper");

const Blog = require("../models/blog");
const User = require("../models/user");

const app = require("../app");
const api = supertest(app);

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({
      username: "root",
      name: "root first",
      passwordHash,
    });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creation fails with a duplicate username", async () => {
    const usersAtStart = await helper.usersInDb();

    const dupUser = {
      username: "root",
      name: "root last",
      password: "asdfasdf",
    };

    await api
      .post("/api/users")
      .send(dupUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);

    const names = usersAtEnd.map((u) => u.name);
    expect(names).not.toContain(dupUser.name);
  });

  test("creation fails with a short username/password", async () => {
    const usersAtStart = await helper.usersInDb();

    const shortUser = {
      username: "foo",
      name: "fo fi",
      password: "as",
    };

    await api
      .post("/api/users")
      .send(shortUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).not.toContain(shortUser.username);
  });
});

afterAll(() => {
  mongoose.connection.close();
});

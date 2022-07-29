const Blog = require("../models/blog");
const User = require("../models/user");

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const initialUsers = [
  {
    username: "apple1",
    name: "Apple One",
    password: "apple",
  },
  {
    username: "banana2",
    name: "Banana 2",
    password: "banana",
  },
  {
    username: "carrot3",
    name: "Carrot Three",
    password: "carrot",
  },
];

const initialBlogs = [
  {
    title: "Root First Blog",
    author: "Root First",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Root Second Blog",
    author: "Root Second",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialUsers,
  initialBlogs,
  blogsInDb,
  usersInDb,
};

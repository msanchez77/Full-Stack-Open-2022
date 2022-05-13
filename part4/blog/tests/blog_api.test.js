const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})


test('returns correct amount of blog posts in JSON', async () => {
  const response = await api
                    .get('/api/blogs')
                    .expect(200)
                    .expect('Content-Type', /application\/json/)

  
  
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('unique identifier property is named \"id\"', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].id).toBeDefined()
})

test('successful addition to database through POST request', async () => {
  const newBlog = {
    title: "Test Blog",
    author: "Super Test",
    url: "https://www.supertest.com/test-blog",
    likes: 5
  }
  
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogDBStateNow = await helper.blogsInDb()
  expect(blogDBStateNow).toHaveLength(helper.initialBlogs.length + 1)
})

test('missing "likes" property defaults', async () => {
  const newBlogMissingLikes = {
    title: "Test Blog",
    author: "Super Test",
    url: "https://www.supertest.com/test-blog"
  }
  
  const response = await api
                    .post('/api/blogs')
                    .send(newBlogMissingLikes)
                    .expect(201)
                    .expect('Content-Type', /application\/json/)

  expect(response.body.likes).toEqual(0)
})

test('missing title/url returns 400 Bad Request', async () => {
  const newBlogMissingTitleUrl = {
    url: "https://www.supertest.com/test-blog"
  }
  
  await api
    .post('/api/blogs')
    .send(newBlogMissingTitleUrl)
    .expect(400)
}, 100000)

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const urls = blogsAtEnd.map(r => r.url)

    expect(urls).not.toContain(blogToDelete.url)
  })
})

describe('updating a blog', () => {
  test('returns updated blog content', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    blogToUpdate.likes = 100

    const updatedBlog = await api
                          .put(`/api/blogs/${blogToUpdate.id}`)
                          .send(blogToUpdate)
    
    expect(updatedBlog.body.likes).toEqual(100)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
const jwt = require('jsonwebtoken')
const blog = require('../models/blog')

const blogRouter = require('express').Router()
const Blog = require('../models/blog')

const {tokenExtractor, userExtractor} = require('../utils/middleware')
const logger = require('../utils/logger')


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const blogToGet = await Blog.findById(request.params.id)
  if (blogToGet) {
    response.json(blogToGet)
  } else {
    response.status(404).end()
  }
})

blogRouter.post('/', tokenExtractor, userExtractor, async (request, response) => {
  // Token authentication taken care of in middleware
  const user = request.user

  const body = request.body
  const blog = new Blog({
    title: body.title,
    author: body.author,
    user: user._id,
    url: body.url,
    likes: body.likes
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', tokenExtractor, userExtractor, async (request, response) => {
  // Token authentication taken care of in middleware
  const user = request.user

  const blogToDelete = await Blog.findById(request.params.id)

  if (!blogToDelete){
    return response.status(400).json({ error: 'Post not found' })
  }

  if (blogToDelete.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'Unauthorized user for this action' })
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', tokenExtractor, userExtractor, async (request, response) => {
  // Token authentication taken care of in middleware
  const user = request.user

  const blogToUpdate = await Blog.findById(request.params.id)

  if (!blogToUpdate){
    return response.status(400).json({ error: 'Post not found' })
  }

  if (blogToUpdate.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'Unauthorized user for this action' })
  }

  const body = request.body
  const updatedInfo = {
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, updatedInfo, {new:true})
  response.json(updatedBlog)
})

module.exports = blogRouter
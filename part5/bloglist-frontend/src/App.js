import { useState, useEffect, useRef } from 'react'

import LoggedInUser from './components/LoggedInUser'
import Notification from './components/Notification'
import Blog from './components/Blog'


import LoginForm from './components/forms/LoginForm'
import BlogForm from './components/forms/BlogForm'

import loginService from './services/login'
import blogService from './services/blogs'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)

  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  const notify = (message, type='info') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  function compareLikes(a, b) {
    if (a.likes > b.likes) {
      return -1
    } else if (a.likes < b.likes) {
      return 1
    } else {
      return 0
    }
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
      notify('User found in local storage')
    }

    //   async function fetchAuthorData() {
    //     const blogsAtStart = await blogService.getAllFromAuthor(user.name)
    //     setBlogs(blogsAtStart)
    //   }
    //   fetchAuthorData()
    // } else {

    async function fetchAllData() {
      const blogsAtStart = await blogService.getAll()
      const sortedBlogs = blogsAtStart.sort(compareLikes)
      setBlogs( sortedBlogs )
    }
    fetchAllData()
  }, [])

  const addBlog = async blogObject => {
    try {
      blogFormRef.current.toggleVisibility()
      const returnedBlog = await blogService.create(blogObject)
      const addedBlogs = blogs.concat(returnedBlog)
      setBlogs(addedBlogs.sort(compareLikes))

      notify(`a new blog "${blogObject.title}" by ${blogObject.author} added`)
    } catch(e) {
      notify(e.response.data.error, 'error')
    }
  }

  const updateBlog = async blogObject => {
    try {
      const returnedBlog = await blogService.update(blogObject)

      const updatedBlogList = blogs.map(blog => {
        if (blog.id === returnedBlog.id) {
          blog.likes = returnedBlog.likes
        }
        return blog
      })


      setBlogs(updatedBlogList.sort(compareLikes))

      notify(`"${blogObject.title}" +1 like!`)
    } catch(e) {
      notify(e.response.data.error, 'error')
    }
  }

  const removeBlog = async blogObject => {
    try {
      await blogService.remove(blogObject)

      const blogsAfterRemoval = blogs.filter((blog) => blog.id !== blogObject.id)
      setBlogs(blogsAfterRemoval)
      notify(`"${blogObject.title}" removed!`)
    } catch(e) {
      notify(e.response.data.error, 'error')
    }
  }

  const startLogin = async (username, password) => {
    try {
      const user = await loginService.login(
        { username, password }
      )

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      notify(`Logging in as ${user.name}`)
    } catch(e) {
      notify(e.response.data.error, 'error')
    }
  }

  // Blog Form method
  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )


  // Return
  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={notification} />

      {user === null ?
        <div>
          <h2>Log in to application</h2>
          <Togglable buttonLabel='login'>
            <LoginForm
              startLogin={startLogin}
            />
          </Togglable>
        </div> :

        <div>
          <LoggedInUser
            user={ user }
            handleUser={() => setUser(null)}
          />
          {blogForm()}
          {blogs.map(blog =>
            <Blog key={blog.id} user={user} blog={blog} updateBlog={updateBlog} removeBlog={removeBlog} />
          )}
        </div>
      }

    </div>
  )
}

export default App
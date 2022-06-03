import { useState, useEffect } from 'react'

import UserView from './components/UserView'
import Notification from './components/Notification'

import LoginForm from './components/forms/LoginForm'
import BlogForm from './components/forms/BlogForm'

import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)

  const [username, setUsername] = useState([])
  const [password, setPassword] = useState([])

  const [user, setUser] = useState(null)

  const [blogFormVisible, setBFVisible] = useState(false)

  const notify = (message, type='info') => {
    setNotification({message, type})
    setTimeout(() => setNotification(null), 5000)
  }

  useEffect(() => {
    async function fetchData() {
      const blogsAtStart = await blogService.getAll()
      setBlogs( blogsAtStart )
    }
    fetchData()
  }, [])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
      notify("User found in local storage")
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login(
        {username, password}
      )

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      notify(`Logging in as ${user.name}`)

    } catch(e) {
      notify(e.response.data.error, "error")
    }
  }

  const addBlog = async blogObject => {
    try {
      const returnedBlog = await blogService.create(blogObject)
    
      setBlogs(blogs.concat(returnedBlog))
      
      notify(`a new blog "${blogObject.title}" by ${blogObject.author} added`)
    } catch(e) {
      notify(e.response.data.error, "error")
    }
  }

  // Blog Form method
  const blogForm = () => (
    <Togglable buttonLabel='new blog'>
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
              handleLogin={handleLogin}
              username={username}
              setUsername={({ target }) => setUsername(target.value)}
              password={password}
              setPassword={({ target }) => setPassword(target.value)}
            />
          </Togglable>
        </div> :

        <div>
          <p>{user.name} logged in</p>
          <UserView
            user={user}
            setUser={setUser}
            blogs={blogs}
            setBlogs={setBlogs}
          />
          {blogForm()}
        </div>
    
      }

    </div>
  )
}

export default App
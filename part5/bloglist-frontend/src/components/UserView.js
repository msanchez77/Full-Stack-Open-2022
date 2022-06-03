import Blog from './Blog'

const UserView = ({user, setUser, blogs, setBlogs}) => {
  const localStorageClear = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
  
    setUser(null)
  }

  return (
    <>
      <h2>{user.name} logged in</h2>
      <button onClick={() => localStorageClear()}>
        logout
      </button>
      <div style={{height: "24px"}}></div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </>
  )
}

export default UserView
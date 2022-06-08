import { useEffect, useState } from 'react'

const Blog = ({ user, blog, updateBlog, removeBlog }) => {

  const [infoVisible, setInfoVisibile] = useState(false)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    // Newly added blog hold user ID first then
    // populates it later with user info
    if (!blog.user.username) {
      setIsOwner(true)
    } else {
      user.username === blog.user.username ? setIsOwner(true) : setIsOwner(false)
    }
  }, [user, blog])


  const handleBlogInfo = () => {
    setInfoVisibile(!infoVisible)
  }

  const handleLikeButton = () => {
    const toUpdate = {
      ...blog,
      likes: blog.likes +1
    }
    updateBlog(toUpdate)
  }

  const handleRemoveButton = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      removeBlog(blog)
    }
  }

  const inlineParagraph = {
    display: 'inline-block',
    marginRight:10,
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div className="blog-info-wrapper" style={blogStyle}>
      <p style={inlineParagraph}>
        {blog.title}
      </p>
      <button onClick={handleBlogInfo}>
        view
      </button>
      {infoVisible ?
        <>
          <p>{blog.url}</p>
          <p>{blog.likes} <button onClick={handleLikeButton}>like</button></p>
          <p>{blog.author}</p>
          {isOwner ?
            <button onClick={handleRemoveButton}>remove</button>
            :
            <></>
          }
        </> :
        <></>
      }
    </div>

  )
}

export default Blog
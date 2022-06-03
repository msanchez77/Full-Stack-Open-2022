import { useState } from 'react'

const BlogForm = ({createBlog}) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleTitleChange = (event) => setNewTitle(event.target.value)
  const handleAuthorChange = (event) => setNewAuthor(event.target.value)
  const handleUrlChange = (event) => setNewUrl(event.target.value)

  const addBlog = async (event) => {
    event.preventDefault()

    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={addBlog}>
        <div className="form-field">
          <label>Title*:</label>
          <input
            value={newTitle}
            onChange={handleTitleChange}
          />
        </div>
        <div className="form-field">
          <label>Author*:</label>
          <input
            value={newAuthor}
            onChange={handleAuthorChange}
          />
        </div>
        <div className="form-field">
          <label>Url:</label>
          <input
            value={newUrl}
            onChange={handleUrlChange}
          />
        </div>
        <button type="submit">create</button>
      </form>  
    </div>
  )
}

export default BlogForm
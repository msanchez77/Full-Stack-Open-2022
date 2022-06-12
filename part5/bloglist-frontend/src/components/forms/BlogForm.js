import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
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
    <div className='blog-form'>
      <h3>create new</h3>
      <form onSubmit={addBlog}>
        <div className="form-field">
          <label>Title*:</label>
          <input
            value={newTitle}
            onChange={handleTitleChange}
            className='title-input'
          />
        </div>
        <div className="form-field">
          <label>Author*:</label>
          <input
            value={newAuthor}
            onChange={handleAuthorChange}
            className='author-input'
          />
        </div>
        <div className="form-field">
          <label>Url:</label>
          <input
            value={newUrl}
            onChange={handleUrlChange}
            className='url-input'
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
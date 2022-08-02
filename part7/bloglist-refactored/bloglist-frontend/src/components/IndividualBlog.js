import { useField } from '../hooks/customHooks'

import { loadAddComment } from '../reducers/blogReducer'

import { useMatch } from "react-router-dom"
import { useDispatch } from 'react-redux'

const CommentsList = ({comments}) => {
  <ul>
    {comments.map(c => <li key={c._id}>c</li>)}
  </ul>
}

const CommentForm = () => {

  const comment = useField('text')
  const dispatch = useDispatch()

  // Getting ID
  const matchBlog = useMatch('/blogs/:id')
  const blogID = matchBlog.params.id

  const actionCommentAdd = async (event) => {
    event.preventDefault()
    
    dispatch(loadAddComment(blogID, comment.value))

    comment.onChange('');
  };

  return (
    <form onSubmit={actionCommentAdd}>
      <label>Comment:</label>
      <input
        {...comment}
        className="comment-input"
      />
      <button type="submit" className="add-comment-btn">
        add comment
      </button>
    </form>
  )

}

const IndividualBlog = ({ individualBlog }) => {

  if (!individualBlog) {
    return null
  }

  return (
    <div className="single-blog">
      <div className="single-blog-info">
        <h2>{individualBlog.title}</h2>
        <p>{individualBlog.url
          ? individualBlog.url 
          : 'There is no URL attached to this blog.'
          }
        </p>
        <p>{individualBlog.likes} likes</p>
        <p>added by {individualBlog.author}</p>
      </div>

      <div className="comment-section">
        <h3>Comments</h3>
        <CommentForm />
        <CommentsList comments={individualBlog.comments}/>
      </div>
    </div>
  )
}

export default IndividualBlog
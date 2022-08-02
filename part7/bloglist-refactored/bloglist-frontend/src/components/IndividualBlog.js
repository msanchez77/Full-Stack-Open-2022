const IndividualBlog = ({ individualBlog }) => {

  if (!individualBlog) {
    return null
  }

  return (
    <div>
      <h2>{individualBlog.title}</h2>
      <p>{individualBlog.url
        ? individualBlog.url 
        : 'There is no URL attached to this blog.'
        }
      </p>
      <p>{individualBlog.likes} likes</p>
      <p>added by {individualBlog.author}</p>
    </div>
  )
}

export default IndividualBlog
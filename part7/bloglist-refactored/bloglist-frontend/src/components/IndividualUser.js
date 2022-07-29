const IndividualUser = ({ individualUser }) => {

  if (!individualUser) {
    return null
  }

  const blogsFromUser = individualUser.blogs


  return (
    <div>
      <h2>{individualUser.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {blogsFromUser.map(blog => 
          <li key={blog.id}>{blog.title}</li>
        )}
      </ul>
    </div>
  )
}

export default IndividualUser
const Notification = ({ message }) => {
  
  if (message === null) {
    return (
      <div className="notification blank">
      </div>
    )
  }

  const classes = `notification ${message.type}`

  return (
    <div className={classes}>
      {message.message}
    </div>
  )


}

export default Notification
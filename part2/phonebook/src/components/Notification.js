const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  if (message.charAt(0) === "A") {
    return (
      <div className='success'>
        {message}
      </div>
    )
  } else {
    return (
      <div className='error'>
        {message}
      </div>
    )
  }
}

export default Notification
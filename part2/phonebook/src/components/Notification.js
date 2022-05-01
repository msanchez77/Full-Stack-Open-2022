const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  if (notification.type === 'info') {
    return (
      <div className='success'>
        {notification.message}
      </div>
    )
  } else {
    return (
      <div className='error'>
        {notification.message}
      </div>
    )
  }
}

export default Notification
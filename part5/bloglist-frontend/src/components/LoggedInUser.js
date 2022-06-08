const LoggedInUser = ({ user, handleUser }) => {
  const localStorageClear = () => {
    window.localStorage.removeItem('loggedBlogAppUser')

    handleUser(null)
  }

  return (
    <>
      <p>{user.name} logged in</p>
      <button onClick={() => localStorageClear()}>
        logout
      </button>
      <div style={{ height: '24px' }}></div>
    </>
  )
}

export default LoggedInUser
import Togglable from "./Togglable"
import LoginForm from "./forms/LoginForm"

const LoginPage = ({user}) => (
  <div>
    <h2>Log in to application</h2>

    <Togglable buttonLabel="login">
      <LoginForm user={user}/>
    </Togglable>
  </div>
)

export default LoginPage
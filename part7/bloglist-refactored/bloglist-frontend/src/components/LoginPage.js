import Togglable from "./Togglable"
import LoginForm from "./forms/LoginForm"

const LoginPage = () => (
  <div>
    <h2>Log in to application</h2>

    <Togglable buttonLabel="login">
      <LoginForm />
    </Togglable>
  </div>
)

export default LoginPage
import { Link } from 'react-router-dom'
import Togglable from './Togglable'
import LoggedInUser from './LoggedInUser'
import LoginForm from './forms/LoginForm'

// Style
const padding = {
  padding: 5
}

const BlogHeader = ({user}) => (
  <header>
    <ul>
      <li><Link style={padding} to="/">Blogs</Link></li>
      <li><Link style={padding} to="/users">Users</Link></li>
      <li className="ml-auto user-account">        
        {user === null 
        ? <div>
            <h2>Log in to application</h2>
            <Togglable buttonLabel="login">
              <LoginForm />
            </Togglable>
          </div>
        : <LoggedInUser user={user} />
        }       
      </li>
    </ul>
  </header>
)

export default BlogHeader
import { Link } from 'react-router-dom'
import { setUser } from "../reducers/userReducer";

// Material UI
import {
  AppBar,
  Toolbar,
  IconButton,
  Button
} from '@mui/material'
import { useDispatch } from 'react-redux'

// Style
const padding = {
  padding: 5
}

const BlogHeaderMUI = ({user}) => {

  const dispatch = useDispatch();

  const localStorageClear = () => {
    window.localStorage.removeItem("loggedBlogAppUser");
  
    dispatch(setUser(null))
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
        </IconButton>
        <Button color="inherit">
          <Link style={padding} to="/">Blogs</Link>
        </Button>
        <Button color="inherit">
          <Link style={padding} to="/users">Users</Link>
        </Button>
        <Button color="inherit" className="ml-auto user-account">        
          {user
            ? <em>{user.name} logged in</em>
            : <Link to="/login">login</Link>
          }       
        </Button>
        <Button color="inherit" onClick={() => localStorageClear()}>
          {user
            ? <em>User</em>
            : <em>No User</em>
          }
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default BlogHeaderMUI
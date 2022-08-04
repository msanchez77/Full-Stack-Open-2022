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

import StyledCustomization from '../styles/muiButtonStyle';

const BlogHeaderMUI = ({user}) => {

  const dispatch = useDispatch();

  const localStorageClear = () => {
    window.localStorage.removeItem("loggedBlogAppUser");
  
    dispatch(setUser(null))
  };

  return (
    <AppBar position="static" className="fullwidth">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
        </IconButton>
        {StyledCustomization({label:'Blogs', path:'/'})}
        {StyledCustomization({label:'Users', path:'/users'})}
                
        {user
          ? <em style={{marginLeft:'auto'}}>{user.name} logged in</em>
          : <Button color="inherit" sx={{marginLeft:'auto'}} className='user-account'>
              <Link to="/login">Login</Link>
            </Button>
        }       
        {user
            ? <Button color="inherit" onClick={() => localStorageClear()}>Logout</Button>
            : <></>
          }

      </Toolbar>
    </AppBar>
  )
}

export default BlogHeaderMUI
/* eslint-disable no-unused-vars */
import { useEffect } from "react";

import LoggedInUser from "./components/LoggedInUser";
import Notification from "./components/Notification";
import BlogList from "./components/BlogList";

import LoginForm from "./components/forms/LoginForm";
import BlogForm from "./components/forms/BlogForm";

import Togglable from "./components/Togglable";


// Redux
import { useDispatch, useSelector } from "react-redux";

import { initializeBlogs } from "./reducers/blogReducer";
import { initializeDatabase } from "./reducers/databaseReducer";
import { setNotification } from "./reducers/notificationReducer";


// React Router

import {
  Routes, Route, Link, useMatch
} from "react-router-dom"
/* eslint-enable no-unused-vars */

import Users from "./components/Users";
import IndividualUser from "./components/IndividualUser";
import IndividualBlog from "./components/IndividualBlog";


const App = () => {
  // Hook/Data Initialization
  const dispatch = useDispatch();
  let user = useSelector(state => state.user)
  let blogs = useSelector(state => state.blogs)
  let users = useSelector(state => state.database)

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeDatabase())
    if (user) {
      dispatch(setNotification(`User - ${user.username} - found in local storage!`, 5))
    }
  }, []);
  /* ------------------------ */


  // Matching URL Parameters
  const matchUser = useMatch('/users/:id')
  const individualUser = matchUser
    ? users.find(user => user.id === matchUser.params.id)
    : null

  const matchBlog = useMatch('/blogs/:id')
  const individualBlog = matchBlog
    ? blogs.find(blog => blog.id === matchBlog.params.id)
    : null

  /* ------------------------ */

  // Conditional Rendering
  const blogForm = () => (
    <>
      <Togglable buttonLabel="new blog">
        <BlogForm />
      </Togglable>
    </>
  );

  const homeView = (user) => {
    return user === null ? 
      <></>
      : 
      <div>
        {blogForm()}
        <BlogList />
      </div>
  }
  /* ------------------------ */

  // Style
  const padding = {
    padding: 5
  }

  /* ------------------------ */

  // Return
  return (
    <div>
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

      <main>
        <h1>Blogs Frontend</h1>
        <Notification />

        <Routes>
          <Route path="/" element={homeView(user)} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<IndividualUser individualUser={individualUser} />} />
          <Route path="/blogs/:id" element={<IndividualBlog individualBlog={individualBlog} />} />
        </Routes>
      </main>
    </div>

  );
};

export default App;

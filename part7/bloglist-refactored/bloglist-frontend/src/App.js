/* eslint-disable no-unused-vars */
import { useEffect } from "react";

import Notification from "./components/Notification";
import BlogList from "./components/BlogList";

import LoginForm from "./components/forms/LoginForm";
import BlogForm from "./components/forms/BlogForm";

import Togglable from "./components/Togglable";


// Redux
import { useDispatch, useSelector } from "react-redux";

import { initializeBlogs } from "./reducers/blogReducer";
import { initializeDatabase } from "./reducers/databaseReducer";
import { clearNotification, setNotification } from "./reducers/notificationReducer";


// React Router

import {
  Routes, Route, Link, useMatch, useNavigate
} from "react-router-dom"
/* eslint-enable no-unused-vars */

import Users from "./components/Users";
import IndividualUser from "./components/IndividualUser";
import IndividualBlog from "./components/IndividualBlog";
// import BlogHeader from "./components/BlogHeader";
import BlogHeaderMUI from "./components/BlogHeaderMUI";
import LoginPage from "./components/LoginPage";

const App = () => {
  // Hook/Data Initialization
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let user = useSelector(state => state.user)
  let blogs = useSelector(state => state.blogs)
  let users = useSelector(state => state.database)

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeDatabase())
    setTimeout(() => dispatch(clearNotification()), 5000)
    
    if (user) dispatch(setNotification(`User - ${user.username} - found in local storage!`, 5))
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/')
    } else {
      dispatch(setNotification('Please login to start blogging', 5))
      navigate('/login')
    }
    dispatch
  }, [user])
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
      <p>Please <Link to="/login">login to start blogging</Link></p>
      : 
      <div>
        {blogForm()}
        <BlogList />
      </div>
  }
  /* ------------------------ */

  // Return
  return (
    <div style={{position:"relative"}}>
      {/* <BlogHeader user={user} /> */}
      <BlogHeaderMUI user={user}/>

      <main>
        <h1>Blogs Frontend</h1>
        <Notification />

        <Routes>
          <Route path="/" element={homeView(user)} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<IndividualUser individualUser={individualUser} />} />
          <Route path="/blogs/:id" element={<IndividualBlog individualBlog={individualBlog} />} />
          <Route path="/login" element={<LoginPage /> } />
        </Routes>

      </main>
    </div>

  );
};

export default App;

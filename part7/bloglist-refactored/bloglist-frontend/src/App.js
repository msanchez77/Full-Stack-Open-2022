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


const App = () => {
  const dispatch = useDispatch();
  let user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeDatabase())
    if (user) {
      dispatch(setNotification(`User - ${user.username} - found in local storage!`, 5))
    }
  }, []);

  // let blogs = useSelector(state => state.blogs)
  let users = useSelector(state => state.database)

  // useMatch
  const match = useMatch('/users/:id')
  const individualUser = match
    ? users.find(user => user.id === match.params.id)
    : null


  // Blog Form method
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

  // Return
  return (
    <div>
      <h1>Blogs Frontend</h1>
      <Notification />

      {user === null ? 
        <div>
          <h2>Log in to application</h2>
          <Togglable buttonLabel="login">
            <LoginForm />
          </Togglable>
        </div>
      :
        <div>
          <LoggedInUser user={user} />
        </div>
      }


      <Routes>
        <Route path="/" element={homeView(user)} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<IndividualUser individualUser={individualUser} />} />
      </Routes>

    </div>


  );
};

export default App;

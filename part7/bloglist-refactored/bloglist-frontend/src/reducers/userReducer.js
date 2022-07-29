import { createSlice } from '@reduxjs/toolkit'

import blogService from "../services/blogs";
import loginService from '../services/login';

import { setNotification } from './notificationReducer'


const checkLocalStorage = () => {
  console.log("Checking local storage...")

  const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON);
    blogService.setToken(user.token);
    return user;
  } else {
    return null;
  }
}


const userSlice = createSlice({
  name: "user",
  initialState: checkLocalStorage(),
  reducers: {
    setUser(state,action) {
      return action.payload
    }
  }
})

export const { setUser } = userSlice.actions

export const loadLogin = (username, password) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      blogService.setToken(user.token);

      dispatch(setUser(user))
      dispatch(setNotification(`Logging in as ${user.name}`, 5));
    } catch (e) {
      dispatch(setNotification(e.response.data.error, 5, "error"));
    }
  }
}

export default userSlice.reducer
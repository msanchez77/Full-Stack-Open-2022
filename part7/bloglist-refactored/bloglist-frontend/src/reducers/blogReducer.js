import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs';

import { setNotification } from './notificationReducer'

function compareLikes(a, b) {
  if (a.likes > b.likes) {
    return -1;
  } else if (a.likes < b.likes) {
    return 1;
  } else {
    return 0;
  }
}

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    appendBlog(state, action) {
      state.push(action.payload);
    },
    updateBlog(state, action) {
      const toReturn = state.map(blog =>
        blog.id !== action.payload.id ? blog : action.payload
      )

      return toReturn.sort(compareLikes)
    },
    removeBlog(state, action) {
      const blogsAfterRemoval = state.filter((blog) => blog.id !== action.payload.id)

      return blogsAfterRemoval
    }
  }
})

export const { setBlogs, appendBlog, updateBlog, removeBlog } = blogSlice.actions;


export const initializeBlogs = () => {
  return async dispatch => {
    const blogsAtStart = await blogService.getAll();
    const sortedBlogs = blogsAtStart.sort(compareLikes);
    dispatch(setBlogs(sortedBlogs));
  }
}

export const createBlog = content => {
  return async dispatch => {
    try {
      const newBlog = await blogService.create(content)
      dispatch(appendBlog(newBlog))
      dispatch(setNotification(`new anecdote '${newBlog.title}'`, 5))
    } catch(e) {
      dispatch(setNotification(e.response.data.error, 5, 'error'))
    }
  }
}

export const loadLikeBlog = updatedContent => {
  return async dispatch => {
    try {
      const returnedBlog = await blogService.update(updatedContent)
      dispatch(updateBlog(returnedBlog))
      dispatch(setNotification(`"${returnedBlog.title}" +1 like!`, 5))
    } catch(e) {
      dispatch(setNotification(e.response.data.error, 5, 'error'))
    }
  }
}

export const loadRemoveBlog = blogObject => {
  return async dispatch => {
    try {
      await blogService.remove(blogObject)

      dispatch(removeBlog(blogObject))
      dispatch(setNotification(`"${blogObject.title}" removed!`, 5))
    } catch(e) {
      dispatch(setNotification(e.response.data.error, 5, 'error'))
    }
  }
}


export default blogSlice.reducer



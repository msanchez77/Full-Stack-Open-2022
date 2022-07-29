import { createSlice } from '@reduxjs/toolkit'

import userService from "../services/users";


const databaseSlice = createSlice({
  name: "database",
  initialState: [],
  reducers: {
    setDatabase(state,action) {
      return action.payload
    }
  }
})

export const { setDatabase } = databaseSlice.actions

export const initializeDatabase = () => {
  return async dispatch => {
    const usersInfo = await userService.getAll();
    dispatch(setDatabase(usersInfo));
  }
}

export default databaseSlice.reducer
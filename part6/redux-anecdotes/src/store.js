import { configureStore } from "@reduxjs/toolkit";
import anecdoteReducer from "./reducers/anecdoteReducer";
import notificationReducer from "./reducers/notificationReducer"

const reducer = {
	anecdotes: anecdoteReducer,
	notification: notificationReducer
}

const store = configureStore({
  reducer
})

export default store
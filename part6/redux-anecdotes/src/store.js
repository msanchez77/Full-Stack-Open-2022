import { configureStore } from "@reduxjs/toolkit";
import anecdoteReducer from "./reducers/anecdoteReducer";
import filterReducer from "./reducers/filterReducer";
import notificationReducer from "./reducers/notificationReducer"

const reducer = {
	anecdotes: anecdoteReducer,
	notification: notificationReducer,
  filter: filterReducer
}

const store = configureStore({
  reducer
})

export default store
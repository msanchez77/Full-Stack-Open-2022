import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notificationReducer";
import blogReducer from './reducers/blogReducer'
import userReducer from "./reducers/userReducer";
import databaseReducer from "./reducers/databaseReducer";


// const preloadedState = {
//   notification: {
//     message: "Notification up and running!",
//     type: "info"
//   }
// }


const store = configureStore({
  reducer: {
    user: userReducer,
    blogs: blogReducer,
    notification: notificationReducer,
    database: databaseReducer
  },
  // preloadedState
});

export default store;

import { setUser } from "../reducers/userReducer";

import { useDispatch } from "react-redux";

const LoggedInUser = ({ user }) => {
  const dispatch = useDispatch()

  const localStorageClear = () => {
    window.localStorage.removeItem("loggedBlogAppUser");

    dispatch(setUser(null))
  };

  return (
    <>
      <span>{user.name} logged in</span>
      <button onClick={() => localStorageClear()}>logout</button>
    </>
  );
};

export default LoggedInUser;

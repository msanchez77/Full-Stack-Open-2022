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
      <p>{user.name} logged in</p>
      <button onClick={() => localStorageClear()}>logout</button>
      <div style={{ height: "24px" }}></div>
    </>
  );
};

export default LoggedInUser;

import { useState } from "react";
import { useDispatch } from "react-redux";

import { loadLogin } from "../../reducers/userReducer"

const LoginForm = () => {
  const [username, setUsername] = useState([]);
  const [password, setPassword] = useState([]);

  const dispatch = useDispatch()

  const handleLogin = async (event) => {
    event.preventDefault();

    dispatch(loadLogin(username, password))

    setUsername("");
    setPassword("");
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
};

export default LoginForm;

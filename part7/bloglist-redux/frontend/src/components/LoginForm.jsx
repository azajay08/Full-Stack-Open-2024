import { useState } from "react";
import { createNotification } from "../reducers/notificationReducer";
import { useDispatch } from "react-redux";
import loginService from "../services/login";
import blogService from "../services/blogs";

const LoginForm = ({doLogin}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // const dispatch = useDispatch();

  const handleLogin = (event) => {
    event.preventDefault()
    doLogin({ username, password })
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            data-testid="username"
            type="text"
            value={username}
            name="Username"
            onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          password
          <input
            data-testid="password"
            type="password"
            value={password}
            name="Password"
            onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
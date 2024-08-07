import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [errorStatus, setErrorStatus] = useState(false);
  const [changeMessage, setChangeMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [refreshBlog, setRefreshBlog] = useState(false);

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      blogs.sort((a, b) => b.likes - a.likes);
      setBlogs(blogs);
    });
  }, [refreshBlog]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      console.log(user.id);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorStatus(true);
      setChangeMessage("wrong username or password");
      setTimeout(() => {
        setChangeMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
  };

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility();
    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog));
      setErrorStatus(false);
      setChangeMessage(
        `a new blog ${blogObject.title} by ${blogObject.author} added`,
      );
      setRefreshBlog(!refreshBlog);
      setTimeout(() => {
        setChangeMessage(null);
      }, 5000);
    });
  };

  const updateBlog = async (id, blogObject) => {
    await blogService.update(id, blogObject);
    setRefreshBlog(!refreshBlog);
  };

  const deleteBlog = async (id) => {
    await blogService.remove(id);
    setRefreshBlog(!refreshBlog);
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={changeMessage} errorStatus={errorStatus} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              data-testid="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              data-testid="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
          <p>{user}</p>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={changeMessage} errorStatus={errorStatus} />
      <p>
        {user.name} logged in{" "}
        <button type="submit" onClick={handleLogout}>
          logout
        </button>
      </p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          deleteBlog={deleteBlog}
          user={user}
        />
      ))}
    </div>
  );
};

export default App;

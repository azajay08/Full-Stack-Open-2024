import { useState } from "react"

const Blog = ({ blog, updateBlog }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const addLikes = () => {
    const blogObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    }
    updateBlog(blog.id, blogObject)
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
       {blog.title} {blog.author}
       <button onClick={toggleVisibility}>hide</button>
       <div>{blog.url}</div>
       <div>likes {blog.likes}
       <button onClick={addLikes}>like</button>
       </div>
       <div>{blog.user!== null && blog.user.name}</div>
      </div>
  </div>
)}

export default Blog
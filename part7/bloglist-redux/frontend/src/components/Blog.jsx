import { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
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

  const handleBlogRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog.id)
    }
  }

  return (
    <div style={blogStyle} className='blog'>
      <div style={hideWhenVisible} className='hiddenBlog'>
        <span>{blog.title} </span>
        <span>{blog.author} </span>
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible} className='visibleBlog'>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>hide</button>
        <div>{blog.url}</div>
        <div>
          <span>likes {blog.likes}</span>
          <button onClick={addLikes}>like</button>
        </div>
        <div>{blog.user !== null && blog.user.name}</div>
        {blog.user.username === user.username && <button onClick={handleBlogRemove}>remove</button>}
      </div>
    </div>
  )
}

export default Blog
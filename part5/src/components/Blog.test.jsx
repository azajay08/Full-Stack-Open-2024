import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders blogs title and author but no other information', () => {
  const user = {
    username: 'user X',
  }
  
  const blog = {
    title: 'Example Blog',
    author: 'Mr Example',
    likes: 42,
    url: 'www.example.com',
    user: user
  }


  const { container } = render(<Blog blog={blog} user={user}/>)

  const div = container.querySelector('.hiddenBlog')
  expect(div).toHaveTextContent('Example Blog Mr Example')
})
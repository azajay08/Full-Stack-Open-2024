import { render, screen } from '@testing-library/react'
import { expect } from 'vitest'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

test('renders blogs title and author but no other information', () => {
  const blogUser = {
    username: 'user X',
  }
  
  const blog = {
    title: 'Example Blog',
    author: 'Mr Example',
    likes: 42,
    url: 'www.example.com',
    user: blogUser
  }


  const { container } = render(<Blog blog={blog} user={blogUser}/>)

  const div = container.querySelector('.hiddenBlog')
  expect(div).toHaveTextContent('Example Blog Mr Example')
  expect(div).not.toHaveTextContent('www.example.com')
  expect(div).not.toHaveTextContent('42')
})

test('shows url and likes when exapnding on blog', () => {
  const blogUser = {
    username: 'user X',
  }
  
  const blog = {
    title: 'Example Blog',
    author: 'Mr Example',
    likes: 42,
    url: 'www.example.com',
    user: blogUser
  }

  const { container } = render(<Blog blog={blog} user={blogUser}/>)

  const div = container.querySelector('.visibleBlog')
  expect(div).toHaveTextContent('www.example.com')
  expect(div).toHaveTextContent('42')
})

test('like button clicked twice', async () => {
  const blogUser = {
    username: 'user X',
  }
  
  const blog = {
    title: 'Example Blog',
    author: 'Mr Example',
    likes: 42,
    url: 'www.example.com',
    user: blogUser
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} user={blogUser} updateBlog={mockHandler}/>)

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
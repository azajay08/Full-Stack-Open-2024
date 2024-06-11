import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state ad calls onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog}/>)

  const titleInput = screen.getByPlaceholderText('write title here')
  const authorInput = screen.getByPlaceholderText('write author here')
  const urlInput = screen.getByPlaceholderText('write url here')
  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'Example Blog')
  await user.type(authorInput, 'Mr Example')
  await user.type(urlInput, 'www.exampleblog.com')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Example Blog')
  expect(createBlog.mock.calls[0][0].author).toBe('Mr Example')
  expect(createBlog.mock.calls[0][0].url).toBe('www.exampleblog.com')
})
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import ShowButton from './ShowButton'
import LikeButton from './LikeButton'
import BlogForm from './BlogForm'

test('renders the blog title', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText(
    'Component testing is done with react-testing-library'
  )
  expect(element).toBeDefined()
})

test('clicking the button shows the blog info and the user', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Author',
    url: 'www.url.com',
    likes: 5,
  }

  const mockHandler = vi.fn()

  render(<ShowButton handleShowButton={mockHandler} blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('View')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})

test('clicking the like button twice calls the event handler twice', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Author',
    url: 'www.url.com',
    likes: 5,
  }

  const mockHandler = vi.fn()

  render(<LikeButton handleLike={mockHandler} blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

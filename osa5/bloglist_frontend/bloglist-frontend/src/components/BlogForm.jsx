import PropTypes from 'prop-types'
import { useState } from 'react'
import blogService from '../services/blogs'

const BlogForm = ({ user, blogs, setBlogs, handleNotification, setBlogsVisible }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newLikes, setNewLikes] = useState(0)

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: newLikes
    }
    try {
      const returnedBlog = await blogService.create(blogObject)
      console.log('Added blog:', returnedBlog)
      returnedBlog.user = {
        username: user.username,
        name: user.name,
        id: user.id
      }
      setBlogs(blogs.concat(returnedBlog))
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
      setNewLikes(0)
      handleNotification('Blog added successfully', 'success')
      setBlogsVisible(false)
    } catch (error) {
      console.error('Error adding blog:', error)
      handleNotification('Error adding blog', 'fail')
    }
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        Title:
        <input
          data-testid='Title'
          value={newTitle}
          name='Title'
          onChange={({ target }) => setNewTitle(target.value)}
        />
      </div>
      <div>
        Author:
        <input
          data-testid='Author'
          type='text'
          value={newAuthor}
          name='Author'
          onChange={({ target }) => setNewAuthor(target.value)}
        />
      </div>
      <div>
        {' '}
        URL:
        <input
          data-testid='URL'
          type='text'
          value={newUrl}
          name='URL'
          onChange={({ target }) => setNewUrl(target.value)}
        />
      </div>
      <div>
        <button type='submit'>save</button>
      </div>
    </form>
  )
}

BlogForm.propTypes = {
  blogs: PropTypes.array.isRequired,
  setBlogs: PropTypes.func.isRequired,
  handleNotification: PropTypes.func.isRequired,
}

export default BlogForm
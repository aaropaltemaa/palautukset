import PropTypes from 'prop-types'
import { useState } from 'react'
import blogService from '../services/blogs'
import { setBlogs } from '../reducers/blogReducer'
import { useNotification } from '../hooks/useNotification'
import { useDispatch } from 'react-redux'
import useBlogFormField from '../hooks/useBlogFormField'

const BlogForm = ({ user, blogs, setBlogsVisible }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newLikes, setNewLikes] = useState(0)
  const dispatch = useDispatch()
  const notify = useNotification()
  const title = useBlogFormField('Title')
  const author = useBlogFormField('Author')
  const url = useBlogFormField('URL')

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: title.value,
      author: author.value,
      url: url.value,
      likes: newLikes,
    }
    try {
      console.log('Adding blog:', blogObject)
      const returnedBlog = await blogService.create(blogObject)
      console.log('Returned blog:', returnedBlog)
      returnedBlog.user = {
        username: user.username,
        name: user.name,
        id: user.id,
      }
      console.log('Updated blog:', returnedBlog)
      dispatch(setBlogs(blogs.concat(returnedBlog)))
      console.log('Blogs after adding:', blogs.concat(returnedBlog))
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
      setNewLikes(0)
      notify('Blog added successfully', 'success')
      setBlogsVisible(false)
    } catch (error) {
      console.error('Error adding blog:', error)
      notify('Error adding blog', 'fail')
    }
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        Title:
        <input {...title} />
      </div>
      <div>
        Author:
        <input {...author} />
      </div>
      <div>
        {' '}
        URL:
        <input {...url} />
      </div>
      <div>
        <button type="submit">save</button>
      </div>
    </form>
  )
}

BlogForm.propTypes = {
  blogs: PropTypes.array.isRequired,
  setBlogs: PropTypes.func.isRequired,
}

export default BlogForm

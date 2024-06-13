import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import OperationSuccess from './components/OperationSuccess'
import OperationFail from './components/OperationFail'
import BlogForm from './components/BlogForm'
import ShowButton from './components/ShowButton'
import LikeButton from './components/LikeButton'
import DeleteButton from './components/DeleteButton'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [addMessage, setAddMessage] = useState(null)
  const [addErrorMessage, setAddErrorMessage] = useState(null)
  const [blogsVisible, setBlogsVisible] = useState(false)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogs = await blogService.getAll()
        console.log('Fetched blogs:', blogs)
        setBlogs(blogs)
      } catch (error) {
        console.error('Error fetching blogs:', error)
      }
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const checkLoggedUser = async () => {
      const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        console.log('Logged user:', user)
        setUser(user)
        blogService.setToken(user.token)
      }
    }
    checkLoggedUser()
  }, [])

  const handleNotification = (message, type = 'success') => {
    if (type === 'success') {
      setAddMessage(message)
      setTimeout(() => setAddMessage(null), 5000)
    } else if (type === 'fail') {
      setAddErrorMessage(message)
      setTimeout(() => setAddErrorMessage(null), 5000)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      handleNotification('Logged in successfully', 'success')
    } catch (exception) {
      handleNotification('Wrong credentials', 'fail')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          data-testid='username'
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          data-testid='password'
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const handleLike = async (blog) => {
    try {
      const updatedBlog = await blogService.like(blog, user)
      updatedBlog.user = blog.user
      updatedBlog.showBlog = blog.showBlog
      setBlogs(blogs.map(b => b.id === blog.id ? updatedBlog : b))
      handleNotification('Blog liked successfully', 'success')
    } catch (error) {
      console.error('Error updating blog likes:', error)
      handleNotification('Error updating blog likes', 'fail')
    }
  }

  const handleDelete = async (id) => {
    const blogToDelete = blogs.find(blog => blog.id === id)

    if (blogToDelete && blogToDelete.user.username === user.username) {
      if (window.confirm(`Remove blog ${blogToDelete.title}?`)) {
        try {
          await blogService.remove(id)
          setBlogs(blogs.filter(blog => blog.id !== id))
          handleNotification('Blog removed successfully', 'success')
        } catch (error) {
          console.error('Error removing blog:', error)
          handleNotification('Error removing blog', 'fail')
        }
      }
    } else {
      handleNotification('You are not authorized to delete this blog', 'fail')
    }
  }

  const blogForm = () => {
    const hideWhenVisible = { display: blogsVisible ? 'none' : '' }
    const showWhenVisible = { display: blogsVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setBlogsVisible(true)}>new blog</button>
        </div>
        <div style={showWhenVisible}>
          <BlogForm
            blogs={blogs}
            setBlogs={setBlogs}
            handleNotification={handleNotification}
            setBlogsVisible={setBlogsVisible}
            user={user}
          />
          <button onClick={() => setBlogsVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const toggleVisibility = id => {
    setBlogs(
      blogs.map(blog => {
        if (blog.id === id) {
          return { ...blog, showBlog: !blog.showBlog }
        }
        return blog
      })
    )
  }

  if (user === null) {
    return (
      <div>
        <div>
          <h2>log in to application</h2>
          {!user && loginForm()}
        </div>
        <OperationSuccess message={addMessage} />
        <OperationFail message={addErrorMessage} />
      </div>
    )
  } else {
    return (
      <div>
        <h2 className="h2 blogs">blogs</h2>
        <OperationSuccess message={addMessage} />
        <OperationFail message={addErrorMessage} />
        <p>
          <u>{user.name}</u> logged in{' '}
          <button onClick={handleLogout}>logout</button>
        </p>
        {blogForm()}
        {blogs.sort((a, b) => b.likes - a.likes).map(blog => (
          <div key={blog.id}>
            <Blog key={blog.id} blog={blog} />
            <ShowButton
              id={blog.id}
              handleShowButton={toggleVisibility}
              showBlog={blog.showBlog}
            />
            <LikeButton blog={blog} handleLike={handleLike} />
            <DeleteButton handleDelete={handleDelete} id={blog.id} showDelete={user && blog.user && blog.user.username === user.username} />
          </div>
        ))}
      </div>
    )
  }
}

export default App

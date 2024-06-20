import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BlogForm from './components/BlogForm'
import UserForm from './components/UserForm'
import CommentForm from './components/CommentForm'
import MainLayout from './components/MainLayout'
import User from './components/User'
import { Navbar, Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import LikeButton from './components/LikeButton'
import DeleteButton from './components/DeleteButton'
import { initializeUsers } from './reducers/usersReducer'
import { useNotification } from './hooks/useNotification'
import { Form, Button } from 'react-bootstrap'
import useLogin from './hooks/useLogin'
import { initializeAndSortBlogs, removeBlog, likeBlog, toggleVisibility, setBlogs, commentBlog } from './reducers/blogReducer'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  Link
} from 'react-router-dom'
import './index.css'

const App = () => {
  const [blogsVisible, setBlogsVisible] = useState(false)
  const [commentsVisible, setCommentsVisible] = useState(false)
  const [user, setUser] = useState(null)

  const notify = useNotification()
  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs)
  const users = useSelector((state) => state.users)

  useEffect(() => {
    dispatch(initializeAndSortBlogs())
  }, [dispatch])

  const { username, password, setUsername, setPassword, handleLogin, handleLogout } = useLogin(setUser)

  useEffect(() => {
    dispatch(initializeUsers())
  }, [dispatch])

  const refreshUsers = () => {
    dispatch(initializeUsers())
  }

  const handleLike = async (blog) => {
    dispatch(likeBlog(blog, user))
    refreshUsers()
  }

  const handleDelete = async (id) => {
    dispatch(removeBlog(id))
    refreshUsers()
  }

  const handleComment = async (blog, comment) => {
    try {
      dispatch(commentBlog(blog, comment))
      notify('Comment added successfully', 'success')
      refreshUsers()
    } catch (error) {
      console.error('Error adding comment:', error)
      notify('Error adding comment', 'fail')
    }
  }

  const loginForm = () => (
    <Form onSubmit={handleLogin}>
      <Form.Group>
        <Form.Label>username:</Form.Label>
        <Form.Control
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        login
      </Button>
    </Form>
  )

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
            setBlogs={(blogs) => dispatch(setBlogs(blogs))}
            blogs={blogs}
            setBlogsVisible={setBlogsVisible}
            user={user}
          />
          <button onClick={() => setBlogsVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const commentForm = (blog) => {
    const hideWhenVisible = { display: commentsVisible ? 'none' : '' }
    const showWhenVisible = { display: commentsVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setCommentsVisible(true)}>new comment</button>
        </div>
        <div style={showWhenVisible}>
          <CommentForm
            blog={blog}
            setCommentsVisible={setCommentsVisible}
          />
          <button onClick={() => setCommentsVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const BlogInfo = () => {
    const id = useParams().id
    const blog = blogs.find((blog) => blog.id === id)
    if (!blog) {
      return null
    }

    return (
      <div>
        <h2>{blog.title}</h2>
        <p>{blog.author}</p>
        <a href={blog.url}>{blog.url}</a>
        <p>{blog.likes} likes</p>
        <LikeButton blog={blog} handleLike={handleLike} />
        {user && blog.user && blog.user.username === user.username && (
          <DeleteButton
            handleDelete={handleDelete}
            id={blog.id}
            showDelete={user && blog.user && blog.user.username === user.username}
          />
        )}
        <p>added by {blog.user.name}</p>
        <h3>comments</h3>
        {commentForm(blog)}
      </div>
    )
  }

  const Menu = () => {
    return (
      <div>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            {user && (
              <Nav className="mr-auto">
                <LinkContainer to="/">
                  <Nav.Link>blogs</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/users">
                  <Nav.Link>users</Nav.Link>
                </LinkContainer>
              </Nav>
            )}
            {user && (
              <Navbar.Text>
                signed in as: {user.username}{' '}
                <Button variant="outline-info" onClick={handleLogout}>
                  Logout
                </Button>
              </Navbar.Text>
            )}
          </Navbar.Collapse>
        </Navbar>
      </div>
    )
  }

  return (
    <Router>
      <div className="container">
        <Menu />
        <Routes>
          <Route
            path="/"
            element={
              <MainLayout
                user={user}
                users={users}
                refreshUsers={refreshUsers}
                blogForm={blogForm}
                blogs={blogs}
                handleLike={handleLike}
                handleDelete={handleDelete}
                dispatch={dispatch}
                toggleVisibility={toggleVisibility}
                loginForm={loginForm}
              />
            }
          />
          <Route path="/users/:id" element={<User />} />
          <Route path="/blogs/:id" element={<BlogInfo />} />
          <Route path="/users" element={<UserForm users={users} refreshUsers={refreshUsers} />} />
        </Routes>
      </div>
    </Router>
  )
}
export default App

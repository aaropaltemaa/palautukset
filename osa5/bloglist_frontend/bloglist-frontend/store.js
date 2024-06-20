import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './src/reducers/notificationReducer'
import usersReducer from './src/reducers/usersReducer'
import blogReducer, { setBlogs } from './src/reducers/blogReducer'
import blogService from './src/services/blogs'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
    users: usersReducer,
  },
})

blogService.getAll().then((blogs) => {
  store.dispatch(setBlogs(blogs))
})

export default store

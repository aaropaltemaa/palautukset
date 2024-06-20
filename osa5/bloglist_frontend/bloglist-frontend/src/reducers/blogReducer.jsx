import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const blogSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        setBlogs(state, action) {
            return action.payload
        },
        sortByLikes(state) {
            return state.sort((a, b) => b.likes - a.likes)
        },
        toggleVisibility(state, action) {
            return state.map((blog) =>
                blog.id === action.payload
                    ? { ...blog, showBlog: !blog.showBlog }
                    : blog
            )
        },
        blogToRemove(state, action) {
            return state.filter((blog) => blog.id !== action.payload)
        },
        blogToLike(state, action) {
            return state.map((blog) =>
                blog.id === action.payload.id
                    ? { ...blog, likes: action.payload.likes }
                    : blog
            )
        },
        blogToComment(state, action) {
            return state.map((blog) =>
                blog.id === action.payload.id
                    ? { ...blog, comments: action.payload.comments }
                    : blog
            )
        }
    },
})

export const initializeBlogs = () => {
    return async (dispatch) => {
        const blogs = await blogService.getAll()
        dispatch(setBlogs(blogs))
    }
}

export const initializeAndSortBlogs = () => {
    return async (dispatch) => {
        await dispatch(initializeBlogs())
        dispatch(sortByLikes())
    }
}

export const likeBlog = (blog, user) => {
    return async (dispatch, getState) => {
        try {
            const updatedBlog = await blogService.like(blog, user)
            updatedBlog.user = blog.user
            updatedBlog.showBlog = blog.showBlog
            dispatch(blogToLike(updatedBlog))
            dispatch(setNotification({ message: 'Blog liked successfully', type: 'success' }))
        } catch (error) {
            console.error('Error updating blog likes:', error)
            dispatch(setNotification({ message: 'Error updating blog likes', type: 'fail' }))
        }
    }
}

export const removeBlog = (id) => {
    return async (dispatch, getState) => {
        try {
            const confirmed = window.confirm('Are you sure you want to remove this blog?')
            if (confirmed) {
                await blogService.remove(id)
                dispatch(blogToRemove(id))
                dispatch(setNotification({ message: 'Blog removed successfully', type: 'success' }))
            }
        } catch (error) {
            console.error('Error removing blog:', error)
            dispatch(setNotification({ message: 'Error removing blog', type: 'fail' }))
        }
    }
}

export const commentBlog = (blog, comment) => {
    return async (dispatch) => {
        const updatedBlog = await blogService.comment(blog.id, comment)
        dispatch(blogToComment(updatedBlog))
    }
}


export const { setBlogs, sortByLikes, toggleVisibility, blogToLike, blogToComment, blogToRemove } = blogSlice.actions

export default blogSlice.reducer
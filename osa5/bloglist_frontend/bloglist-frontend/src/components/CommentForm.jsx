import { useState } from 'react'
import { useNotification } from '../hooks/useNotification'
import { useDispatch } from 'react-redux'
import useBlogFormField from '../hooks/useBlogFormField'
import { commentBlog } from '../reducers/blogReducer'
import blogService from '../services/blogs'

const CommentForm = ({ blog, setCommentsVisible, handleComment }) => {
    const [newComment, setNewComment] = useState('')
    const dispatch = useDispatch()
    const notify = useNotification()
    const comment = useBlogFormField('Comment')

    const addComment = async (event) => {
        event.preventDefault()
        const commentObject = {
            comment: comment.value,
        }
        try {
            console.log('Adding comment:', commentObject)
            const returnedBlog = await blogService.comment(blog.id, commentObject)
            console.log('Returned blog:', returnedBlog)
            dispatch(commentBlog(returnedBlog))
            console.log('Blog after adding comment:', returnedBlog)
            setNewComment('')
            notify('Comment added successfully', 'success')
            setCommentsVisible(false)
        } catch (error) {
            console.error('Error adding comment:', error)
            notify('Error adding comment', 'fail')
        }
    }

    return (
        <form onSubmit={addComment}>
            <div>
                Comment:
                <input {...comment} />
            </div>
            <button type="submit">Add comment</button>
        </form>
    )
}

export default CommentForm
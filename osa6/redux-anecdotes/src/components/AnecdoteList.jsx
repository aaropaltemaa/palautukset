import { useDispatch, useSelector } from 'react-redux'
import { voteForAnecdote, sortByVotes } from '../reducers/anecdoteReducer'
import { useEffect } from 'react'
import { setNotification, clearNotification } from '../reducers/notificationReducer'

const Anecdotes = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(state => state.anecdotes)
    const filter = useSelector(state => state.filter) 

    const filteredAnecdotes = anecdotes.filter(anecdote =>
        anecdote.content && filter 
        ? anecdote.content.toLowerCase().includes(filter.toLowerCase())
        : true
    )

    useEffect(() => {
        dispatch(sortByVotes())
    }, [anecdotes, dispatch])

    return (
        <div>
            {filteredAnecdotes.map(anecdote => {
                return (
                    <div key={anecdote.id}>
                        <div>
                            {anecdote.content}
                        </div>
                        <div>
                            has {anecdote.votes}
                            <button onClick={() => {
                                dispatch(voteForAnecdote(anecdote))
                                dispatch(setNotification(`You voted for '${anecdote.content}'`))
                                setTimeout(() => {
                                    dispatch(clearNotification())
                                }, 5000)
                            }}>vote</button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Anecdotes

import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    vote: (state, action) => {
      const id = action.payload.id
      const anecdoteToChange = state.find(n => n.id === id)
      if (!anecdoteToChange) {
        return
      }
      anecdoteToChange.votes = action.payload.votes
    },
    sortByVotes: (state) => {
      state.sort((a, b) => b.votes - a.votes)
    },
    appendAnecdote: (state, action) => {
      state.push(action.payload)
    },
    setAnecdotes: (state, action) => {
      return action.payload
    }
  }}
)

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}
export const createAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteForAnecdote = (anecdote) => {
  return async dispatch => {
    const updatedAnecdote = await anecdoteService.voteFor(anecdote)
    dispatch(vote(updatedAnecdote))

  }
}

export const { vote, sortByVotes, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export default anecdoteSlice.reducer

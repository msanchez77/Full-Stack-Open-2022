import { createSlice } from "@reduxjs/toolkit"

import anecdoteService from '../services/anecdotes'

function compareVotes(a, b) {
  if (a.votes > b.votes) {
    return -1
  } else if (a.votes < b.votes) {
    return 1
  } else {
    return 0
  }
}

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
		appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
		updateAnecdote(state, action) {
			const toReturn = state.map(anecdote =>
				anecdote.id !== action.payload.id ? anecdote : action.payload
			)
			return toReturn.sort(compareVotes)
		}
  }
})

export const { appendAnecdote, setAnecdotes, updateAnecdote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
	return async dispatch => {
		const anecdotes = await anecdoteService.getAll()
		dispatch(setAnecdotes(anecdotes))
	}
}

export const createAnecdote = content => {
	return async dispatch => {
		const newAnecdote = await anecdoteService.createNew(content)
		dispatch(appendAnecdote(newAnecdote))
	}
}

export const voteAnecdote = id => {
	return async dispatch => {
		const anecdotes = await anecdoteService.getAll()
		const toChange = anecdotes.find(an => an.id === id)
		const changed = {
			...toChange,
			votes: toChange.votes + 1
		}
		await anecdoteService.registerVote(changed)
		dispatch(updateAnecdote(changed))
	}
}

export default anecdoteSlice.reducer
import { createSlice } from "@reduxjs/toolkit"

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
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    voteAnecdote(state, action) {
      const id = action.payload
      
      const toChange = state.find(an => an.id === id)
      const changed = {
        ...toChange,
        votes: toChange.votes + 1
      }

      const toReturn = state.map(anecdote => 
        anecdote.id !== id ? anecdote : changed  
      )

      return toReturn.sort(compareVotes)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { createAnecdote, voteAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer
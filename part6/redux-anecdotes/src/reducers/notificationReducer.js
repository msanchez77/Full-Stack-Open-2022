import { createSlice } from '@reduxjs/toolkit'

const initialState = 'Hello'

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    voteAnecdote(state, action) {
      const anecdote = action.payload
      state = anecdote
    },
    removeNotif(state, action) {
      state = ''
    }
  }
})

export const { voteAnecdote, removeNotif } = notificationSlice.actions
export default notificationSlice.reducer
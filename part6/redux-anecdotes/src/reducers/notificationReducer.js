import { createSlice } from '@reduxjs/toolkit'

const initialState = 'Notification up and running!'

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    voteAnecdote(state, action) {
      console.log("Notif reducer")
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
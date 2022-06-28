import { createSlice } from '@reduxjs/toolkit'

const initialState = 'Notification up and running!'

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotificationVote(state,action) {
			return `you voted '${action.payload}'`
		},
    setNotificationAnecdote(state, action) {
      return `you created '${action.payload}'`
    },
    clearNotification() {
      return ''
    }
	}
})

export const { setNotificationVote, setNotificationAnecdote, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer
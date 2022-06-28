import { createSlice } from '@reduxjs/toolkit'

const initialState = 'Notification up and running!'

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotificationVote(state,action) {
			return action.payload
		}
	}
})

export const { setNotificationVote, setNotificationAnecdote, removeNotif } = notificationSlice.actions
export default notificationSlice.reducer
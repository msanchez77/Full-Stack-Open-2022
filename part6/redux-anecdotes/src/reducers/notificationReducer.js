import { createSlice } from '@reduxjs/toolkit'

const initialState = 'Notification up and running!'

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotificationAction(state,action) {
			return `you voted '${action.payload}'`
		},
    clearNotification() {
      return ''
    }
	}
})

export const { setNotificationAction, clearNotification } = notificationSlice.actions

export const setNotification = (appInfo, time) => {
	return async dispatch => {
		dispatch(setNotificationAction(appInfo))
    setTimeout(() => 
      dispatch(clearNotification())
    , (time*1000))
	}
}

export default notificationSlice.reducer
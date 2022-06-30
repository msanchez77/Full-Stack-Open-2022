import { createSlice } from '@reduxjs/toolkit'

const initialState = 'Notification up and running!'

let timeoutId = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotificationAction(state,action) {
			return `${action.payload}`
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

    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    timeoutId = setTimeout(() =>
        dispatch(clearNotification())
      , (time*1000))
	}
}

export default notificationSlice.reducer
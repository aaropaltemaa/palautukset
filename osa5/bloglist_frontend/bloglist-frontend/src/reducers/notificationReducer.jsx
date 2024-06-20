import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotification: (state, action) => {
      const { message, type, timeout } = action.payload
      return { message, type, timeout }
    },
    clearNotification: () => null,
  },
})

export const { setNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer

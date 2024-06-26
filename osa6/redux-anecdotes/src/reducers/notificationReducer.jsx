import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        setNotification: (state, action) => {
            console.log('ACTION:', action)
            return action.payload
        },
        clearNotification: () => null
    }
})

export const { setNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer


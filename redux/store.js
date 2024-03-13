import { configureStore } from '@reduxjs/toolkit'
import nicknameReducer from './nicknameTracker'

export default configureStore({
  reducer: {
    nicknames: nicknameReducer,
  },
})

import { createSlice } from '@reduxjs/toolkit'

export const slice = createSlice({
  name: 'nicknames',
  initialState: [],
  reducers: {
    changeNickname: (state, action) => {
      const nickname = action.payload.nickname
      const realname = action.payload.realname
      if (state.some((n) => n.realname === realname)) {
        const index = state.findIndex((n) => n.realname === realname)
        state[index] = { nickname: nickname, realname: realname }
      } else {
        state.push({ nickname: nickname, realname: realname })
      }
    },
  },
})

export const { changeNickname } = slice.actions

export default slice.reducer

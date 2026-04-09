import { createSlice } from '@reduxjs/toolkit'

type CelebrationState = {
  auctionEndedConfettiNonce: number
}

const initialState: CelebrationState = {
  auctionEndedConfettiNonce: 0,
}

const celebrationSlice = createSlice({
  name: 'celebration',
  initialState,
  reducers: {
    triggerAuctionEndedConfetti: (state) => {
      state.auctionEndedConfettiNonce += 1
    },
  },
})

export const { triggerAuctionEndedConfetti } = celebrationSlice.actions
export default celebrationSlice.reducer

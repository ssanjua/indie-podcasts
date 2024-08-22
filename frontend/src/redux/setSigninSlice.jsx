import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    opensi: false,
    opensu: false,
}

const signinSlice = createSlice({
    name: 'authModals',
    initialState,
    reducers: {
        openSignin: (state) => {
            state.opensi = true
            state.opensu = false
        },
        closeSignin: (state) => {
            state.opensi = false
        },
        openSignup: (state) => {
            state.opensu = true
            state.opensi = false
        },
        closeSignup: (state) => {
            state.opensu = false
        }
    }
})

export const { openSignin, closeSignin, openSignup, closeSignup } = signinSlice.actions
export default signinSlice.reducer
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'

// we have to parse here because local storages can only have strings
const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
    user: user ? user : null,
    isRejected: false,
    isPending: false,
    isFulfilled: false,
    message: ''
}

// remember thunkAPI can be used to show nice pop up error messages, and! to get the value of global state values
export const register = createAsyncThunk(
    'auth/register', 
    async(userData, thunkAPI) => {
        try {
            return await authService.register(userData)
        } catch (error) {
            const message = error.response.data
            console.log(error.message)
            // console.log(error)
            // console.log(error.message)
            // console.log(error.response)
            return thunkAPI.rejectWithValue(message)
        }
    }
    )

export const login = createAsyncThunk(
    'auth/login',
    async(userData, thunkAPI) => {
        try {
            return await authService.login(userData)
        } catch (error) {
            const message = error.response.data
            console.log(error.message)
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isRejected = false
            state.isPending = false
            state.isFulfilled = false
            state.message = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isPending = true
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isPending = false
                state.isFulfilled = true
                state.user = action.payload
            })
            .addCase(register.rejected, (state, action) => {
                state.isPending = false
                state.isRejected = true
                state.message = action.payload
                state.user = null
            })            
            
            .addCase(login.pending, (state) => {
                state.isPending = true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isPending = false
                state.isFulfilled = true
                state.user = action.payload
            })
            .addCase(login.rejected, (state, action) => {
                state.isPending = false
                state.isRejected = true
                state.message = action.payload
                state.user = null
            })
    }
})

export default authSlice.reducer
export const { reset } = authSlice.actions
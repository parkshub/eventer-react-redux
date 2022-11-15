import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'

const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
    user: user ? user: null,
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: ''
}

export const register = createAsyncThunk('auth/login', async (user, thunkAPI) => {
    try {
        return await authService.register(user)   
    } catch (error) {
        const message = (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

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
            .addCase(register.rejected, (state, action) => {
                state.isRejected = true
                state.isPending = false
                state.message = action.payload
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false
                state.isPending = false
                state.user = action.payload
            })
    }
})

export const { reset } = authSlice.actions
export default authSlice.reducer
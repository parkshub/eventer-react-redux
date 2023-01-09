import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import authService from "./authService"

const user = JSON.parse(localStorage.getItem("user"))

const initialState = {
    user: user ? user : null,
    visitingUser: "",
    isRejected: false,
    isPending: false,
    isFulfilled: false,
    message: ""
}

export const register = createAsyncThunk(
    "auth/register", 
    async(userData, thunkAPI) => {
        try {
            return await authService.register(userData)
        } catch (error) {
            const message = error.response.data
            return thunkAPI.rejectWithValue(message)
        }
    }
    )

export const login = createAsyncThunk(
    "auth/login",
    async(userData, thunkAPI) => {
        try {
            return await authService.login(userData)
        } catch (error) {
            const message = error.response.data
            return thunkAPI.rejectWithValue(message)
        }
    }
)   

export const logout = createAsyncThunk(
    "auth/logout",
    async(_, thunkAPI) => {
        await authService.logout()
    }
)

export const attendEventUser = createAsyncThunk(
    "auth/attendEvent",
    async(id, thunkAPI) => {
        try {
            return await authService.attendEventUser(id)
        } catch (error) {
            const message = error.response.data
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const unattendEventUser = createAsyncThunk(
    "auth/unattendEvent",
    async(id, thunkAPI) => {
        try {
            return await authService.unattendEventUser(id)
        } catch (error) {
            const message = error.response.data
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const getUserInfo = createAsyncThunk(
    "auth/getUserInfo",
    async(id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await authService.getUserInfo(token, id)
        } catch (error) {
            const message = error.response.message
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const changeProfile = createAsyncThunk(
    'auth/changeProfile',
    async(userData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await authService.changeProfile(token, userData)
        } catch (error) {
            const message = error.response.data
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => {
            state.visitingUser = ""
            state.isRejected = false
            state.isPending = false
            state.isFulfilled = false
            state.message = ""
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
            .addCase(logout.fulfilled, (state) => {
                state.user = null
            })
            .addCase(attendEventUser.fulfilled, (state, action) => {
                state.isPending = false
                state.isFulfilled = true
                state.user.attending.push(action.payload)
            })
            .addCase(unattendEventUser.fulfilled, (state, action) => {
                state.isPending = false
                state.isFulfilled = true
                state.user.attending = action.payload
            })
            .addCase(getUserInfo.fulfilled, (state, action) => {
                state.isPending = false
                state.isFulfilled = true
                state.visitingUser = action.payload
            })            
            .addCase(changeProfile.pending, (state) => {
                state.isPending = true
            })
            .addCase(changeProfile.fulfilled, (state, action) => {
                state.isPending = false
                state.isFulfilled = true
                state.user = action.payload
            })
            .addCase(changeProfile.rejected, (state, action) => {
                state.isPending = false
                state.isRejected = true
                state.message = action.payload
                state.user = null
            })
    }
})

export default authSlice.reducer
export const { reset } = authSlice.actions
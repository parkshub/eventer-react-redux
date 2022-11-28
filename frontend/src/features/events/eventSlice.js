import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { logout } from "../auth/authSlice";
import eventService from './eventService'

const initialState = {
    event: '',
    homeEvents: [],
    userEvents: [],
    isPending: false,
    isRejected: false, 
    isFulfilled: false,
    message: ''
}


export const getHomeEvents = createAsyncThunk(
    'event/getHomeEvents',
    async(_, thunkAPI) => {
        try {
            return await eventService.getHomeEvents()
        } catch (error) {
            const message = error.response.data
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const getUserEvents = createAsyncThunk(
    'event/getUserEvents',
    async(id, thunkAPI) => {
        try {
            console.log('getUserEvents slice')
            const token = thunkAPI.getState().auth.user.token
            return await eventService.getUserEvents(token, id)
        } catch (error) {
            const message = error.response.data
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const getEvent = createAsyncThunk(
    'event/getEvent',
    async(id, thunkAPI) => {
        try {
            console.log('getEventPage slice')
            return await eventService.getEvent(id)
        } catch (error) {
            const message = error.response.data
            return thunkAPI.rejectWithValue(message)
        }
    }
)



const eventSlice = createSlice({
    name: 'event',
    initialState,
    reducers: {
        reset: (state) => {
            state.event = ''
            state.userEvents = []
            state.homeEvents = []
            state.isPending = false
            state.isRejected = false
            state.isFulfilled = false
            state.message = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getHomeEvents.pending, (state) => {
                state.isPending = true
            })
            .addCase(getHomeEvents.fulfilled, (state, action) => {
                state.isPending = false
                state.isFulfilled = true
                state.homeEvents.push(action.payload)
            })
            .addCase(getHomeEvents.rejected, (state, action) => {
                state.isPending = false
                state.isRejected = true
                state.message = action.payload
                state.homeEvents = []
            })
            .addCase(getEvent.pending, (state) => {
                state.isPending = true
            })
            .addCase(getEvent.fulfilled, (state, action) => {
                state.isPending = false
                state.isFulfilled = true
                state.event = action.payload
            })
            .addCase(getEvent.rejected, (state, action) => {
                state.isPending = false
                state.isRejected = true
                state.message = action.payload
                state.event = ''
            })
            .addCase(getUserEvents.pending, (state) => {
                state.isPending = true
            })
            .addCase(getUserEvents.fulfilled, (state, action) => {
                state.isPending = false
                state.isFulfilled = true
                state.userEvents.push(action.payload)
            })
            .addCase(getUserEvents.rejected, (state, action) => {
                state.isPending = false
                state.isRejected = true
                state.message = action.payload
                state.userEvents = []
            })
    }
})

export default eventSlice.reducer
export const { reset } = eventSlice.actions
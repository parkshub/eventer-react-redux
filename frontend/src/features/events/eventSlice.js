import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import eventService from './eventService'

const initialState = {
    homeEvents: [],
    event: '',
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
    }
})

export default eventSlice.reducer
export const { reset } = eventSlice.actions
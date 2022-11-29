import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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

export const createEvent = createAsyncThunk(
    'event/createEvent',
    async(formData, thunkAPI) => {
        try {
            // const formData = {title:'meh', caption:'myeh'}
            console.log('createEvent slice')
            const token = thunkAPI.getState().auth.user.token
            return await eventService.createEvent(token, formData)
        } catch (error) {
            const message = error.response.data
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const attendEvent = createAsyncThunk(
    'event/attendEvent',
    async(id, thunkAPI) => {
        try {
            console.log('attendEvent slice')
            const token = thunkAPI.getState().auth.user.token
            return await eventService.attendEvent(token, id)
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
                state.userEvents = action.payload
            })
            .addCase(getUserEvents.rejected, (state, action) => {
                state.isPending = false
                state.isRejected = true
                state.message = action.payload
                state.userEvents = []
            })
            .addCase(createEvent.pending, (state) => {
                state.isPending = true
            })
            .addCase(createEvent.fulfilled, (state) => {
                state.isPending = false
                state.isFulfilled = true
            })
            .addCase(createEvent.rejected, (state, action) => {
                state.isPending = false
                state.isRejected = true
                state.message = action.payload
            })
            .addCase(attendEvent.pending, (state) => {
                state.isPending = true
            })
            .addCase(attendEvent.fulfilled, (state) => {
                state.isPending = false
                state.isFulfilled = true
            })
            .addCase(attendEvent.rejected, (state, action) => {
                state.isPending = false
                state.isRejected = true
                state.message = action.payload
            })
    }
})

export default eventSlice.reducer
export const { reset } = eventSlice.actions
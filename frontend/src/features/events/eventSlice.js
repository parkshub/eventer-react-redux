import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import eventService from './eventService'

const initialState = {
    events: [],
    // homeEvents:'',
    isPending: false,
    isRejected: false, 
    isFulfilled: false,
    message: ''
}

export const getHomeEvents = createAsyncThunk(
    'event/getHomeEvents',
    async(_, thunkAPI) => {
        console.log('here slice1')
        try {
            console.log('here slice2')
            // const dude = await eventService.getHomeEvents()
            // console.log('this is dude--->', dude)
            return await eventService.getHomeEvents()
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
            console.log('here reseter')
            state.events = []
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
                state.events.push(action.payload)
            })
            .addCase(getHomeEvents.rejected, (state, action) => {
                state.isPending = false
                state.isRejected = true
                state.message = action.payload
                state.events = []
            })    
    }
})

export default eventSlice.reducer
export const { reset } = eventSlice.actions
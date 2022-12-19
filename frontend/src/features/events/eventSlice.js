import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import eventService from './eventService'

const initialState = {
    event: '',
    homeEvents: [],
    userEvents: [],
    attendingEvents: '',
    events: '',
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


export const createEvent = createAsyncThunk(
    'event/createEvent',
    async({formData, selectedFile}, thunkAPI) => {
        try {
            console.log('createEvent slice')
            const token = thunkAPI.getState().auth.user.token
            return await eventService.createEvent(token, {formData, selectedFile})
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



export const deleteEvent = createAsyncThunk(
    'event/delete',
    async(id, thunkAPI) => {
        try {
            console.log(`deleteEvent slice`)
            const token = thunkAPI.getState().auth.user.token
            return await eventService.deleteEvent(token, id)
        } catch (error) {
            const message = error.response.data
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const updateEvent = createAsyncThunk(
    'event/updateEvent',
    async({formData, selectedFile}, thunkAPI) => {
        console.log('updateEvent Slice')
        try {
            const token = thunkAPI.getState().auth.user.token
            return await eventService.updateEvent(token, {formData, selectedFile})
        } catch (error) {
            
        }
    }
)

export const unattendEvent = createAsyncThunk(
    'event/unattend',
    async(formData, thunkAPI) => {
        try {
            console.log('unattendEvent slice')
            const token = thunkAPI.getState().auth.user.token
            return await eventService.unattendEvent(token, formData)

        } catch (error) {
            const message = error.response.data
            return thunkAPI.rejectWithValue(message)
        }
    }
)
// export const getUserEvents = createAsyncThunk(
//     'event/getUserEvents',
//     async(_, thunkAPI) => {
//         try {
//             console.log('getUserEvents slice')
//             const token = thunkAPI.getState().auth.user.token
//             return await eventService.getUserEvents(token)
//         } catch (error) {
//             const message = error.response.data
//             return thunkAPI.rejectWithValue(message)
//         }
//     }
// )

// export const getAttendingEvents = createAsyncThunk(
//     'event/attendingEvents',
//     async(_, thunkAPI) => {
//         try {
//             console.log('getAttendingEvents slice')
//             const token = thunkAPI.getState().auth.user.token
//             // return await eventService.getAttendingEvents(token, attendingEvents)
//             return await eventService.getAttendingEvents(token)
//         } catch (error) {
//             const message = error.response.data
//             return thunkAPI.rejectWithValue(message)
//         }
//     }
// )

export const getProfileEvents = createAsyncThunk(
    'event/getProfileEvents',
    async(id, thunkAPI) => {
        try {
            console.log('getProfileEvents slice')
            const token = thunkAPI.getState().auth.user.token
            return await eventService.getProfileEvents(id, token)
        } catch (error) {
            const message = error.response.data
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const getAllEvents = createAsyncThunk(
    'event/getAllEvents',
    async(_, thunkAPI) => {
        try {
            console.log('getAllEvents Slice')
            const token = thunkAPI.getState().auth.user.token
            return await eventService.getAllEvents(token)
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
            state.events = ''
            state.userEvents = []
            state.homeEvents = []
            state.attendingEvents = ''
            state.isPending = false
            state.isRejected = false
            state.isFulfilled = false
            state.message = ''
        },
        resetHomeEvents: (state) => {
            state.homeEvents = []
            state.isPending = false
            state.isFulfilled = false
            state.isRejected = false
            state.message = false
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
                state.homeEvents = action.payload
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
            .addCase(deleteEvent.pending, (state) => {
                state.isPending = true
            })
            .addCase(deleteEvent.fulfilled, (state) => {
                state.isPending = false
                state.isFulfilled = true
                state.event = ''
            })
            .addCase(deleteEvent.rejected, (state, action) => {
                state.isPending = false
                state.isRejected = true
                state.message = action.payload
            })
            .addCase(updateEvent.pending, (state) => {
                state.isPending = true
            })
            .addCase(updateEvent.fulfilled, (state) => {
                state.isPending = false
                state.isFulfilled = true
                state.event = ''
            })
            .addCase(updateEvent.rejected, (state, action) => {
                state.isPending = false
                state.isRejected = true
                state.message = action.payload
            })
            
            .addCase(unattendEvent.pending, (state) => {
                state.isPending = true
            })
            .addCase(unattendEvent.fulfilled, (state, action) => {
                state.isPending = false
                state.isFulfilled = true
                state.event = action.payload
            })
            .addCase(unattendEvent.rejected, (state, action) => {
                state.isPending = false
                state.isRejected = true
                state.message = action.payload
            })
            // .addCase(getAttendingEvents.pending, (state) => {
                //     state.isPending = true
                // })
            // .addCase(getAttendingEvents.fulfilled, (state, action) => {
                //     state.isPending = false
                //     state.isFulfilled = true
                //     state.attendingEvents = action.payload
                // })
            // .addCase(getAttendingEvents.rejected, (state, action) => {
                //     state.isPending = false
                //     state.isRejected = true
                //     state.message = action.payload
                // })
            // .addCase(getUserEvents.pending, (state) => {
            //     state.isPending = true
            // })
            // .addCase(getUserEvents.fulfilled, (state, action) => {
            //     state.isPending = false
            //     state.isFulfilled = true
            //     state.userEvents = action.payload
            // })
            // .addCase(getUserEvents.rejected, (state, action) => {
            //     state.isPending = false
            //     state.isRejected = true
            //     state.message = action.payload
            //     state.userEvents = []
            // })
            .addCase(getProfileEvents.pending, (state) => {
                state.isPending = true
            })
            .addCase(getProfileEvents.fulfilled, (state, action) => {
                state.isPending = false
                state.isFulfilled = true
                state.events = action.payload
            })
            .addCase(getProfileEvents.rejected, (state, action) => {
                state.isPending = false
                state.isRejected = true
                state.message = action.payload
            })
            .addCase(getAllEvents.pending, (state) => {
                state.isPending = true
            })
            .addCase(getAllEvents.fulfilled, (state, action) => {
                state.isPending = false
                state.isFulfilled = true
                state.events = action.payload
            })
            .addCase(getAllEvents.rejected, (state, action) => {
                state.isPending = false
                state.isRejected = true
                state.message = action.payload
            })
        }
    })
    
    export default eventSlice.reducer
    export const { reset, resetHomeEvents } = eventSlice.actions
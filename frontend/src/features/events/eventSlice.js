import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import eventService from "./eventService"

const initialState = {
    event: "",
    homeEvents: [],
    userEvents: [],
    visitingProfile:"",
    attendingEvents: "",
    profileEvents: "",
    events: "",
    isPending: false,
    isRejected: false, 
    isFulfilled: false,
    message: ""
}


export const getHomeEvents = createAsyncThunk(
    "event/getHomeEvents",
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
    "event/getEvent",
    async(id, thunkAPI) => {
        try {
            return await eventService.getEvent(id)
        } catch (error) {
            const message = error.response.data
            return thunkAPI.rejectWithValue(message)
        }
    }
)


export const createEvent = createAsyncThunk(
    "event/createEvent",
    async({formData, selectedFile}, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await eventService.createEvent(token, {formData, selectedFile})
        } catch (error) {
            const message = error.response.data
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const attendEvent = createAsyncThunk(
    "event/attendEvent",
    async(id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await eventService.attendEvent(token, id)
        } catch (error) {
            const message = error.response.data
            return thunkAPI.rejectWithValue(message)
        }
        
    }
)



export const deleteEvent = createAsyncThunk(
    "event/delete",
    async(id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await eventService.deleteEvent(token, id)
        } catch (error) {
            const message = error.response.data
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const updateEvent = createAsyncThunk(
    "event/updateEvent",
    async({formData, selectedFile}, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await eventService.updateEvent(token, {formData, selectedFile})
        } catch (error) {
            
        }
    }
)

export const unattendEvent = createAsyncThunk(
    "event/unattend",
    async(formData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await eventService.unattendEvent(token, formData)

        } catch (error) {
            const message = error.response.data
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const getProfileEvents = createAsyncThunk(
    "event/getProfileEvents",
    async(id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await eventService.getProfileEvents(id, token)
        } catch (error) {
            const message = error.response.data
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const getAllEvents = createAsyncThunk(
    "event/getAllEvents",
    async(_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await eventService.getAllEvents(token)
        } catch (error) {
            const message = error.response.data
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const getVisitingProfile = createAsyncThunk(
    "event/getVisitngProfile",
    async (id) => {
        localStorage.setItem("visitingProfile", JSON.stringify(id))
    }
)

const eventSlice = createSlice({
    name: "event",
    initialState,
    reducers: {
        reset: (state) => {
            state.event = ""
            state.events = ""
            state.userEvents = []
            state.homeEvents = []
            state.attendingEvents = ""
            state.isPending = false
            state.isRejected = false
            state.isFulfilled = false
            state.message = ""
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
                state.event = ""
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
                state.event = ""
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
                state.event = ""
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
            .addCase(getProfileEvents.pending, (state) => {
                state.isPending = true
            })
            .addCase(getProfileEvents.fulfilled, (state, action) => {
                state.isPending = false
                state.isFulfilled = true
                state.profileEvents = action.payload
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
            .addCase(getVisitingProfile.fulfilled, (state) => {
                state.isFulfilled = true
            })
        }
    })
    
    export default eventSlice.reducer
    export const { reset, resetHomeEvents } = eventSlice.actions
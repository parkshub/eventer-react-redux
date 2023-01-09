import axios from "axios"

const API_URL = "/api/event/"

const getHomeEvents = async() => {
    const response = await axios.get(API_URL + "getHomeEvents")
    return response.data
}

const getEvent = async(id) => {
    const response = await axios.get(API_URL + `getEvent/${id}`)
    if (response.data) {
        localStorage.setItem("event", JSON.stringify(response.data))
    }
    return response.data
}

const createEvent = async(token, {formData, selectedFile}) => {
    const config = {
        headers: {
          authorization: `Bearer ${token}`,
        }
    }

    const response = await axios.post(API_URL, {formData, selectedFile}, config)
    return response.data
}


const deleteEvent = async(token, id) => {
    const config = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.delete(API_URL + `deleteEvent/${id}`, config)
    return response.data
}

const updateEvent = async(token, {formData, selectedFile}) => {
    const config = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
    const id = formData._id

    const response = await axios.put(API_URL + `updateEvent/${id}`, {formData, selectedFile}, config)

    return response.data
}

const attendEvent = async(token, id) => {    
    const config = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put(API_URL + `attendEvent/${id}`, null, config)
    if (response.data) {
        localStorage.setItem('event', JSON.stringify(response.data))
    }
    return response.data
}

const unattendEvent = async(token, formData) => {
    const config = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const eventId = formData._id

    const response = await axios.put(API_URL + `unattendEvent/${eventId}`, formData, config)
    
    if (response.data) {
        localStorage.setItem('event', JSON.stringify(response.data))
    }
    return response.data
}

const getProfileEvents = async(id, token) => {
    const config = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL + `getProfileEvents/${id}`, config)
    return response.data
}

const getAllEvents = async(token) => {
    const response = await axios.get(API_URL + "getAllEvents")

    if (response.data) {
        localStorage.setItem("events", JSON.stringify(response.data))
    }

    return response.data
}

const eventService = {
    getHomeEvents,
    getEvent,
    createEvent,
    attendEvent,
    deleteEvent,
    updateEvent,
    unattendEvent,
    getProfileEvents,
    getAllEvents,
}

export default eventService
import axios from 'axios'

const API_URL = '/api/event/'


const getHomeEvents = async() => {
    const response = await axios.get(API_URL + 'getHomeEvents')
    return response.data
}

const getEvent = async(id) => {
    console.log('getEventPage service')
    const response = await axios.get(API_URL + `getEvent/${id}`)
    // localStorage.setItem('event', JSON.stringify(response.data))
    return response.data
}

const getUserEvents = async(token, id) => {
    console.log('getUserEvents service')
    const config = {
        headers: {
          authorization: `Bearer ${token}`,
        }
    }
    const response = await axios.get(API_URL + `getUserEvents/${id}`, config)
    return response.data
}

const createEvent = async(token, {formData, selectedFile}) => {
    console.log('createEvent service')
    const config = {
        headers: {
          authorization: `Bearer ${token}`,
        }
    }

    const response = await axios.post(API_URL, {formData, selectedFile}, config)
    return response.data
}

const attendEvent = async(token, id) => {
    console.log('attendEvent service')
    
    const config = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put(API_URL + `attendEvent/${id}`, null, config)
    return response.data
}

const deleteEvent = async(token, id) => {
    console.log('deleteEvent service')
    const config = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.delete(API_URL + `deleteEvent/${id}`, config)
    return response.data
}

const updateEvent = async(token, {formData, selectedFile}) => {

    console.log('updateEvent service')

    const config = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
    const id = formData._id

    const response = await axios.put(API_URL + `updateEvent/${id}`, {formData, selectedFile}, config)

    return response.data
}

const unattendEvent = async(token, formData) => {

    console.log('unattendEvent service')

    const config = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const eventId = formData._id

    const response = await axios.put(API_URL + `unattendEvent/${eventId}`, formData, config)
    return response.data
}

const getAttendingEvents = async(token, attendingEvents) => {
    console.log('getAttendingEvents service')
    const config = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL + 'getAttendingEvents', config)
    return response.data
}

const eventService = {
    getHomeEvents,
    getEvent,
    getUserEvents,
    createEvent,
    attendEvent,
    deleteEvent,
    updateEvent,
    unattendEvent,
    getAttendingEvents
}

export default eventService
import axios from 'axios'

const API_URL = '/api/event/'


const getHomeEvents = async() => {
    const response = await axios.get(API_URL + 'getHomeEvents')
    return response.data
}

const getEvent = async(id) => {
    console.log('getEventPage service')
    const response = await axios.get(API_URL + `getEvent/${id}`)
    return response.data
}

const getUserEvents = async(token, id) => {
    console.log('getUserEvents service searching for id', id)
    const config = {
        headers: {
          authorization: `Bearer ${token}`,
        }
    }
    const response = await axios.get(API_URL + `getUserEvents/${id}`, config)
    console.log('this was the response===>', response.data)
    return response.data
}

const createEvent = async(token, formData) => {
    console.log('createEvent service')
    const config = {
        headers: {
          authorization: `Bearer ${token}`,
        }
    }

    const response = await axios.post(API_URL, formData, config)

    return response.data
}

const attendEvent = async(token, id) => {
    console.log('attendEvent service')
    
    const config = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put(API_URL + `attendEvent/${id}`, config)
    console.log('this was the response--->', response.data)
    return response.data
}

const eventService = {
    getHomeEvents,
    getEvent,
    getUserEvents,
    createEvent,
    attendEvent
}

export default eventService
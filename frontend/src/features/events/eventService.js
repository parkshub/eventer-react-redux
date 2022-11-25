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

const eventService = {
    getHomeEvents,
    getEvent,
}

export default eventService
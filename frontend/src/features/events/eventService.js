import axios from 'axios'

const API_URL = '/api/event/'


const getHomeEvents = async() => {
    console.log('here services')
    const response = await axios.get(API_URL + 'getHomeEvents')
    console.log('this was the response' + JSON.stringify(response))
    console.log('this was the response in data' + JSON.stringify(response.data))
    response.data.map(x => {
        console.log('im mapping the events--->', x)
    })
    console.log(Array.isArray(response.data))
    return response.data
}

const eventService = {
    getHomeEvents,
}

export default eventService
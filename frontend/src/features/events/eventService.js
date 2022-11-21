import axios from 'axios'

const API_URL = '/api/event/'


const getHomeEvents = async(_, res) => {
    console.log('here services')
    const response = await axios.get(API_URL + 'getHomeEvents')
    console.log('this was the response' + JSON.stringify(response))
    console.log('this was the response in data' + JSON.stringify(response.data))
    res.json(response.data)
}

const eventService = {
    getHomeEvents,
}

export default eventService
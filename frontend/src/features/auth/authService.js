import axios from 'axios'

const API_URL = '/api/user/'

const register = async(userData) => {
    const response = await axios.post(API_URL, userData)

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }


    return response.data
}

const login = async(userData) => {
    const response = await axios.post(API_URL + 'login', userData)
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
}

const logout = async() => {
    console.log('logout service')
    await localStorage.clear()
    // await localStorage.removeItem('user') IT WAS THIS BEFORE CHANGE IT BACK IF SOMETHING BREAKS
}

const attendEventUser = async(id) => {
    console.log('attendEventUser service')
    const user = JSON.parse(localStorage.getItem('user'))
    user.attending.push(id)
    localStorage.setItem('user', JSON.stringify(user))
    return id
}

const unattendEventUser = async(id) => {
    console.log('unattendEventUser service')
    const user = JSON.parse(localStorage.getItem('user'))
    user.attending = user.attending.filter(x => x!==id)
    localStorage.setItem('user', JSON.stringify(user))
    return user.attending
}

const authService = {
    register,    
    login,
    logout,
    attendEventUser,
    unattendEventUser
}

export default authService
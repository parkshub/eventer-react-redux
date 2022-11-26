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
    console.log(response)

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
}

const logout = async() => {
    console.log('logout service')
    await localStorage.removeItem('user')
}

const authService = {
    register,    
    login,
    logout,
}

export default authService
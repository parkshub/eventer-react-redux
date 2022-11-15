import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Login() {
    return (
        <section className="form">
        <form action="">
            
            <label htmlFor="email">email</label>
            <input type="email" id='email'/>

            <label htmlFor="password">password</label>
            <input type="password" id='password'/>

            <button>Login</button>
        </form>
    </section>
    )
}

export default Login
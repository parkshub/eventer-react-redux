import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Register() {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    // const { user } = 

    return (
        <section className="form">
            <form action="">
                <label htmlFor="userName">username</label>
                <input type="text" id='userName'/>
                
                <label htmlFor="email">email</label>
                <input type="email" id='email'/>

                <label htmlFor="password1">password</label>
                <input type="password" id='password1'/>

                <label htmlFor="password2">confirm password</label>
                <input type="password" id='password2'/>

                <button>Register</button>
            </form>
        </section>
    )
}

export default Register
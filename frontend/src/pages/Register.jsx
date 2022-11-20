import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { register, reset } from '../features/auth/authSlice'

function Register() {

    const [formData, setFormData] = useState({
        userName:'',
        email: '',
        password: '',
        password2: '',

    })
    const {userName, email, password, password2} = formData

    const dispatch = useDispatch()
    const navigate = useNavigate()

    // why is this not a global state? because we only need it verify login and we only need the user data like their name and token

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    const onSubmit = (e) => {
        e.preventDefault()

        const userData = {
            userName,
            email,
            password
        }

        dispatch(register(userData))
        dispatch(reset())
    }

    return (
        <section className="form">
            <form action="" onSubmit={onSubmit}>
                <label htmlFor="userName">username</label>
                <input type="text" name='userName' id='userName' value={userName} onChange={onChange}/>
                
                <label htmlFor="email">email</label>
                <input type="email" name='email' id='email' value={email} onChange={onChange}/>

                <label htmlFor="password">password</label>
                <input type="password" name='password' id='password' value={password} onChange={onChange}/>

                <label htmlFor="password2">confirm password</label>
                <input type="password" name='password2' id='password2' value={password2} onChange={onChange}/>

                <button>Register</button>
            </form>
        </section>
    )
}

export default Register
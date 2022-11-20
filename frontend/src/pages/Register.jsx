import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { register, reset } from '../features/auth/authSlice'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'


function Register() {

    const [formData, setFormData] = useState({
        name:'',
        email: '',
        password: '',
        password2: '',

    })
    const {name, email, password, password2} = formData
    
    const { user, isRejected, isPending, isFulfilled, message } = useSelector((state) => state.auth)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    // why is this not a global state? because we only need it verify login and we only need the user data like their name and token

    useEffect(() => {
        if (isRejected) {
            toast.error(message) // this is working 
        }

        if (isFulfilled || user) {
            console.log(isFulfilled, user)
            navigate('/')
        }

        dispatch(reset())
    }, [user, isRejected, isFulfilled, message, dispatch, navigate])

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
        console.log(formData)
        console.log(name, email, password, password2)
    }

    const onSubmit = (e) => {
        e.preventDefault()

        if (password !== password2) {
            toast.error('passwords do not match')
        } else {

        const userData = {
            name,
            email,
            password
        }

        dispatch(register(userData))
        }

    }

    if (isPending) {
        return <Loading/>
    }

    return (
        <section className="form">
            <form action="" onSubmit={onSubmit}>
                <label htmlFor="name">username</label>
                <input type="text" name='name' id='name' value={name} onChange={onChange}/>
                
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
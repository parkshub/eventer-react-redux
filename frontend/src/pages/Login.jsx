import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { login, reset } from '../features/auth/authSlice'
import Loading from '../components/Loading'

function Login() {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const { email, password } = formData

    const { user, isPending, isFulfilled, isRejected, message } = useSelector((state) => state.auth)

    const dispatch = useDispatch()
    const navigate = useNavigate()


    useEffect(() => {
        if (isRejected) {
            toast.error(message)
        }
        if (isFulfilled) {
            navigate('/')
        }
        dispatch(reset())
    }, [isPending, isFulfilled, isRejected, message, dispatch, navigate])

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
        console.log(formData)
    }

    const onSubmit = (e) => {
        e.preventDefault()
        dispatch(login(formData))
    }

    if (isPending) {
        return <Loading />
    }

    return (
        <section className="form">
        <form action="" onSubmit={onSubmit}>
            
            <label htmlFor="email">email</label>
            <input type="email" name='email' value = {email} id='email' onChange={onChange}/>

            <label htmlFor="password">password</label>
            <input type="password" name='password' value = {password} id='password' onChange={onChange}/>

            <button>Login</button>
        </form>
    </section>
    )
}

export default Login
import React, {useState, useEffect} from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { login, reset } from "../features/auth/authSlice"
import Loading from "../components/Loading"

function Login() {

    const [formData, setFormData] = useState({
        email: "",
        password: ""
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
            navigate("/")
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
        <>
            <section className='heading'>
                <h1>Login</h1>
                <p>Please login</p>
            </section>
            <section className="form">
                <form  onSubmit={ onSubmit }>
                    
                    <div className="formGroup">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" value = { email } id="email" onChange={ onChange }/>
                    </div>

                    <div className="formGroup">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" value = { password } id="password" onChange={ onChange }/>
                    </div>

                    <div className="formGroup">
                        <button className="btn" type="submit">Login</button>
                    </div>

                </form>
            </section>
        </>
    )
}

export default Login
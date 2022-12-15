//https://betterprogramming.pub/create-a-letter-picture-like-google-with-react-ae12a7a4390e
// https://github.com/danilo95/letter-picture-like-Google-with-React

import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { register, reset } from '../features/auth/authSlice'
import { toast } from 'react-toastify'
import { createImageFromInitials } from '../components/Utils'
import { SketchPicker } from "react-color";

import Loading from '../components/Loading'


function Register() {

    // const [formData, setFormData] = useState({
    //     firstName:'',
    //     lastName:'',
    //     email: '',
    //     password: '',
    //     password2: '',
    //     image: '',

    // })
    const [formData, setFormData] = useState({
        firstName:'new',
        lastName:'new',
        email: 'new@new.com',
        password: 'new',
        password2: 'new',
        image: '',

    })
    const {firstName, lastName, email, password, password2} = formData

    const [selectedFile, setSelectedFile] = useState('')
    const [sketchPickerColor, setSketchPickerColor] = useState('#4F57B0');
    const [choice, setChoice] = useState('');

    
    const { user, isRejected, isPending, isFulfilled, message } = useSelector((state) => state.auth)

	let imgSrc = "";

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (isRejected) {
            toast.error(message)
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
    }

    const onSelectFile = (e) => {
        const file = e.target.files[0];
        
        const fileSize = e.target.files.item(0).size
        const fileMb = fileSize / 1024 ** 2
    
        if (fileMb > 5) {
          toast.error('file too large')
          setSelectedFile('')
        }
        else {
          let reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onloadend = () => {
              setSelectedFile(reader.result)
          }
        }
    }

    const onChoiceChange = (e) => {
        console.log(e.target.value)
        setChoice(e.target.value)
        if (e.target.value == 'default') {
            setSelectedFile('')
            document.querySelector("#profilePic").value = ''
        }
    }

    // const onColorChange = (e) => {
    //     console.log(e.hex)
    //     setFormData((prev) => ({
    //         ...prev,
    //         image: e.hex
    //     }))
    // }

    const onSubmit = (e) => {
        e.preventDefault()

        if (password !== password2) {
            toast.error('passwords do not match')
        } else {

            const userData = {
                firstName,
                lastName,
                email,
                password,
                image: choice === 'upload' ? selectedFile : sketchPickerColor
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
                <label htmlFor="firstName">first name</label>
                <input type="text" name='firstName' id='firstName' value={firstName} onChange={onChange}/>

                <label htmlFor="lastName">last name</label>
                <input type="text" name='lastName' id='lastName' value={lastName} onChange={onChange}/>

                
                <label htmlFor="email">email</label>
                <input type="email" name='email' id='email' value={email} onChange={onChange}/>

                <label htmlFor="password">password</label>
                <input type="password" name='password' id='password' value={password} onChange={onChange}/>

                <label htmlFor="password2">confirm password</label>
                <input type="password" name='password2' id='password2' value={password2} onChange={onChange}/>

                <label htmlFor="photo">Choose own photo or choose default?</label>

                <select name="photo" id="photo" defaultValue={choice} onChange={onChoiceChange}>
                    <option value="">please choose an option</option>
                    <option value="upload">upload own photo</option>
                    <option value="default">choose default photo</option>
                </select>

                    <div className={choice==='upload' ? '' : 'hide'}>
                        <label htmlFor="profilePic">Select profile picture less than 5mb</label>
                        <input id="profilePic" type="file" name="profilePic" onChange={ onSelectFile } className="form-input"/>
                        {/* <input id="profilePic" type="file" name="profilePic" onChange={ onFileChange } className="form-input"/> */}
                    </div>


                    <div id='colorPicker' className={choice==='default' ? '' : 'hide'}>
                        <img id='preview' className='profileImagePreview defaultPic' src={ imgSrc.length <= 0 ? createImageFromInitials(300, formData.firstName + ' ' + formData.lastName, sketchPickerColor) : imgSrc } alt='profile-pic' />
                        <h6>Customize Color</h6>
                        <SketchPicker onChange={(color) => { setSketchPickerColor(color.hex); }} color={sketchPickerColor} /> 
                    </div>

                <button>Register</button>
            </form>

            <img src={selectedFile} className={selectedFile ? 'profileImagePreview' : 'hide '} width={300} height={300}/>

        </section>
    )
}

export default Register
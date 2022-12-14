import React, {useState, useEffect} from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { createImageFromInitials } from "../components/Utils"
import Loading from "../components/Loading"
import { register, reset } from "../features/auth/authSlice"
import { toast } from "react-toastify"
import { SketchPicker } from "react-color";

function Register() {

    const [formData, setFormData] = useState({
        firstName:"",
        lastName:"",
        email: "",
        password: "",
        password2: "",
        image: "",
        bio: "",

    })
    const { firstName, lastName, email, password, password2, bio } = formData

    const [selectedFile, setSelectedFile] = useState("")
    const [sketchPickerColor, setSketchPickerColor] = useState("#4F57B0");
    const [choice, setChoice] = useState("");
    const [bioLength, setBioLength] = useState("150");

    
    const { user, isRejected, isPending, isFulfilled, message } = useSelector((state) => state.auth)

	let imgSrc = "";

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (isRejected) {
            toast.error(message)
        }

        if (isFulfilled || user) {
            navigate("/")
        }

        dispatch(reset())
    }, [user, isRejected, isFulfilled, message, dispatch, navigate])

    const onChange = (e) => {

        if (e.target.id === "bio") {
            setBioLength(150 - e.target.value.length)
        }

        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    const onSelectFile = (e) => {

        if (e.target.files[0]!==undefined) {
            
            const file = e.target.files[0];
            const fileSize = e.target.files.item(0).size
            const fileMb = fileSize / 1024 ** 2
        
            if (fileMb > 5) {
                toast.error("file too large")
                document.querySelector("#profilePic").value = ""
            }
            else {
                let reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onloadend = () => {
                    setSelectedFile(reader.result)
                }
            }
        }
    }

    const onChoiceChange = (e) => {
        setChoice(e.target.value)
    }

    const onSubmit = (e) => {
        e.preventDefault()

        if (password !== password2) {
            toast.error("passwords do not match")
        } else {

            const userData = {
                firstName,
                lastName,
                email,
                password,
                image: choice === "upload" ? selectedFile : sketchPickerColor,
                bio
            }

            dispatch(register(userData))
        }

    }

    if (isPending) {
        return <Loading/>
    }

    return (
        <>
            <section className='heading'>
                <h1>
                 Register
                </h1>
                <p>Please create an account</p>
            </section>

            <section className="form">
                <form onSubmit={ onSubmit }>

                    <div className="formGroup">
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" name="firstName" id="firstName" value={ firstName } onChange={ onChange }/>
                    </div>
                    
                    <div className="formGroup">
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" name="lastName" id="lastName" value={ lastName } onChange={ onChange }/>
                    </div>

                    <div className="formGroup">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" value={ email } onChange={ onChange }/>
                    </div>

                    <div className="formGroup">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" value={ password } onChange={ onChange }/>
                    </div>

                    <div className="formGroup">
                        <label htmlFor="password2">Confirm Password</label>
                        <input type="password" name="password2" id="password2" value={ password2 } onChange={ onChange }/>
                    </div>

                    <div className="formGroup">
                        <label htmlFor="bio">Bio character limit: { bioLength }</label>
                        <textarea name="bio" id="bio" rows={ 4 } value={ bio } onChange={ onChange } maxLength={ 150 } />
                    </div>

                    <div className="formGroup">
                        <label htmlFor="photo">Choose own photo or choose default?</label>
                        <select name="photo" id="photo" defaultValue={ choice } onChange={ onChoiceChange }>
                            <option value="">please choose an option</option>
                            <option value="upload">upload own photo</option>
                            <option value="default">choose default photo</option>
                        </select>
                    </div>

                    <div className={ choice==="upload" ? "formGroup" : "hide" }>
                        <label htmlFor="profilePic">Select profile picture less than 5MBs</label>
                        <input id="profilePic" type="file" name="profilePic" onChange={ onSelectFile } className="form-input"/>
                    </div>


                    <div className="formGroup">
                        <img src={ selectedFile } className={ choice==='upload' && selectedFile ? "profileImagePreview" : "hide " } width={ 300 } height={ 300 } alt="preview"/>
                    </div>

                    <div className={ choice==="default" ? "formGroup defaultImageContainer" : "hide" }>
                        <img id="preview" className="defaultImagePreview" src={ imgSrc.length <= 0 ? createImageFromInitials(200, formData.firstName + " " + formData.lastName, sketchPickerColor) : imgSrc } alt="preview" />
                        <h6>Customize Color</h6>
                        
                        <SketchPicker id="colorPicker" disableAlpha={ true } onChange={(color) => { setSketchPickerColor(color.hex); }} color={sketchPickerColor} /> 
                    </div>

                    <div className="formGroup">
                        <button type="submit" className="btn">Register</button>
                    </div>
                </form>
            </section>
        </>
    )
}

export default Register
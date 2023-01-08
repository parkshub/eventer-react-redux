import React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { SketchPicker } from "react-color";
import { createImageFromInitials } from "../components/Utils"
import Loading from "../components/Loading"
import { changeProfile } from "../features/auth/authSlice"
import { toast } from "react-toastify"


function ProfileForm() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { user, isPending, isRejected } = useSelector((state) => state.auth)
    
    const [formData, setFormData] = useState(user)
    const {id ,firstName, lastName, image, bio} = formData
    
    const imageType = image.startsWith('#') ? 'hex' : 'image'
    
    
    const [selectedFile, setSelectedFile] = useState(imageType ==='image' ? image : '')
    const [sketchPickerColor, setSketchPickerColor] = useState(imageType === 'hex' ? image : "#4F57B0");
    const [choice, setChoice] = useState(imageType === 'image' ? 'upload' : 'default');
    const [bioLength, setBioLength] = useState("150");

    let imgSrc = ""

    console.log(selectedFile, sketchPickerColor)


    const onChange = (e) => {

        if (e.target.id === "bio") {
            setBioLength(150 - e.target.value.length)
        }

        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
        console.log(formData)
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

    const onSubmit = async(e) => {
        e.preventDefault()
        const userData = {
            id,
            firstName,
            lastName,
            image: choice === "upload" ? selectedFile : sketchPickerColor,
            bio
        }
        
        await dispatch(changeProfile(userData))
        navigate('/profile')
    }

    if (isPending) {
        return <Loading />
    }

    return (
        <>
            <section className="heading">
                <h1>Edit Profile</h1>
                <p>Please enter changes</p>
            </section>
            
            <section className="form">
                <form onSubmit={onSubmit}>

                    <div className="formGroup">
                        <label htmlFor="firstName">First Name</label>
                        <input id="firstName" name="firstName" type="text" value={firstName} onChange={onChange}/>
                    </div>

                    <div className="formGroup">
                        <label htmlFor="lastName">Last Name</label>
                        <input id="lastName" name="lastName" type="text" value={lastName} onChange={onChange}/>
                    </div>

                    <div className="formGroup">
                        <label htmlFor="bio">Bio character limit: {bioLength}</label>
                        <textarea name="bio" id="bio" rows={4} value={bio} onChange={ onChange } maxLength={150} />
                    </div>

                    <div className="formGroup">
                        <label htmlFor="photo">Choose own photo or choose default?</label>
                        <select name="photo" id="photo" defaultValue={ choice } onChange={ onChoiceChange }>
                            <option value="upload">upload own photo</option>
                            <option value="default">choose default photo</option>
                        </select>
                    </div>

                    <div className={choice==="upload" ? "formGroup" : "hide"}>
                        <label htmlFor="imageUpload">Select profile picture less than 5MBs</label>
                        <input id="imageUpload" type="file" name="imageUpload" onChange={ onSelectFile } className="form-input"/>
                    </div>

                    
                    <div id="colorPicker" className={choice==="default" ? "formGroup image-container" : "hide"}>
                        <img id="preview" className="profileImagePreview" src={ imgSrc.length <= 0 ? createImageFromInitials(300, formData.firstName + " " + formData.lastName, sketchPickerColor) : imgSrc } alt="profile" />
                        <h6>Customize Color</h6>
                        <SketchPicker disableAlpha={true} onChange={(color) => { setSketchPickerColor(color.hex); }} color={sketchPickerColor} /> 
                    </div>

                    <div className="formGroup image-container">
                        <img src={selectedFile} className={choice==='upload' && selectedFile ? "profileImagePreview" : "hide "} width={300} height={300} alt="profile"/>
                    </div>

                    <div className="formGroup">
                        <button className="btn" type="submit">Submit Changes</button>
                    </div>

                </form>

            </section>
        </>
    )
}

export default ProfileForm
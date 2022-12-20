import React from "react"
import { useSelector } from "react-redux"

import { useState } from "react"
import { useEffect } from "react"

import { toast } from "react-toastify"
import { createImageFromInitials } from "../components/Utils"
import { SketchPicker } from "react-color";

import { useDispatch } from "react-redux"
import { changeProfile } from "../features/auth/authSlice"
import { useNavigate } from "react-router-dom"

function ProfileForm() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { user, isPending, isRejected } = useSelector((state) => state.auth)
    
    const [formData, setFormData] = useState(user)
    const {id ,firstName, lastName, image, bio} = formData
    
    const fullName = firstName + " " + lastName

    const imageType = image.startsWith('#') ? 'hex' : 'image'
    
    
    const [selectedFile, setSelectedFile] = useState(imageType=='image' ? image : '')
    const [sketchPickerColor, setSketchPickerColor] = useState(imageType=='hex' ? image : "#4F57B0");
    const [choice, setChoice] = useState(imageType == 'image' ? 'upload' : 'default');
    const [bioLength, setBioLength] = useState("150");

    // const [fileName, setFileName] = useState('')

    let imgSrc = ""

    console.log(selectedFile, sketchPickerColor)


    const onChange = (e) => {

        if (e.target.id == "bio") {
            setBioLength(150-e.target.value.length)
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

    const onSubmit = (e) => {
        e.preventDefault()
        const userData = {
            id,
            firstName,
            lastName,
            image: choice === "upload" ? selectedFile : sketchPickerColor,
            bio
        }
        
        dispatch(changeProfile(userData))
        navigate('/profile')
    }

    return (
        <>
            <div>Edit Profile Info</div>
            
            <section className="form">
                <form action="" onSubmit={onSubmit}>
                    
                    <label htmlFor="firstName">First Name</label>
                    <input id="firstName" name="firstName" type="text" value={firstName} onChange={onChange}/>

                    <label htmlFor="lastName">Last Name</label>
                    <input id="lastName" name="lastName" type="text" value={lastName} onChange={onChange}/>

                    <label htmlFor="bio">Bio character limit: {bioLength}</label>
                    <input id="bio" name="bio" type="text" value={bio} onChange={onChange}/>

                    <label htmlFor="photo">Choose own photo or choose default?</label>

                    <select name="photo" id="photo" defaultValue={ choice } onChange={ onChoiceChange }>
                        <option value="upload">upload own photo</option>
                        <option value="default">choose default photo</option>
                    </select>

                    <div className={choice==="upload" ? "" : "hide"}>
                        <label htmlFor="profilePic">Select profile picture less than 5mb</label>
                        <input id="profilePic" type="file" name="profilePic" onChange={ onSelectFile } className="form-input"/>
                        {/* <input id="profilePic" type="file" name="profilePic" onChange={ onFileChange } className="form-input"/> */}
                    </div>


                    <div id="colorPicker" className={choice==="default" ? "" : "hide"}>
                        <img id="preview" className="profileImagePreview defaultPic" src={ imgSrc.length <= 0 ? createImageFromInitials(300, formData.firstName + " " + formData.lastName, sketchPickerColor) : imgSrc } alt="profile-pic" />
                        <h6>Customize Color</h6>
                        <SketchPicker onChange={(color) => { setSketchPickerColor(color.hex); }} color={sketchPickerColor} /> 
                    </div>

                    <button type="submit">Submit Changes</button>
                </form>

                <img src={selectedFile} className={choice==='upload' && selectedFile ? "profileImagePreview" : "hide "} width={300} height={300}/>

            </section>
        </>
    )
}

export default ProfileForm
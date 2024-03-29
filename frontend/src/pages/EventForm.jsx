import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { createEvent, updateEvent } from "../features/events/eventSlice"
import Loading from "../components/Loading"
import { toast } from "react-toastify"

import { cities } from "../components/Utils"

function EventForm() {

  const edit = localStorage.getItem("event") ? true : false
  
  let date = new Date()

  date = date.getFullYear() 
    + "-" 
    + (date.getMonth() >= 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1))
    + "-"
    + (date.getDate() >= 9 ? date.getDate() + 1 : '0' + (date.getDate() + 2)) 
    + "T00:00" 

  console.log('this is date', date)

  const eventObj = {
    title:"",
    caption:"",
    description: "",
    dateTime: date,
    street: "",
    city: "Acton",
    maxAttendee: "",
  }

  const { isPending } = useSelector((state) => state.events)

  const [formData, setFormData] = useState(localStorage.getItem("event") ? JSON.parse(localStorage.getItem("event")) : eventObj)
  const [selectedFile, setSelectedFile] = useState(localStorage.getItem("event") ? JSON.parse(localStorage.getItem("event")).imageUrl : "")
  const [captionLength, setCaptionLength] = useState("50");
  const [descriptionLength, setDescriptionLength] = useState("150");

  console.log('this is desc length', descriptionLength)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { title, caption, description, dateTime, street, maxAttendee } = formData

  const buttonDisable = title && caption && dateTime && selectedFile ? false : true

  const onChange = (e) => {

    if (e.target.id === "caption") {
      setCaptionLength(50 - e.target.value.length)
    }

    if (e.target.id === "description") {
      e.target.value.length > 150 ? setDescriptionLength(0) : setDescriptionLength(150 - e.target.value.length)
    }

    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  const onSelectFile = (e) => {
    const file = e.target.files[0];
    
    const fileSize = e.target.files.item(0).size
    const fileMb = fileSize / 1024 ** 2

    if (fileMb > 5) {
      toast.error("file too large")
      document.querySelector("#eventImage").value = ""
    }
    else {
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
          setSelectedFile(reader.result)
      }
    }
};
  
  const onSubmit = async(e) => {
      e.preventDefault()

      if (descriptionLength > 0) {
        toast.error('Please describe your event in greater detail')
      } else {
        if (edit) {
          await dispatch(updateEvent({ formData, selectedFile }))
        } else {
          await dispatch(createEvent({ formData, selectedFile }))
        }
        navigate("/profile")
      }
  }

  console.log('this is formdata', formData, Object.values(formData).includes(""))

  if (isPending) {
    return <Loading />
  }

  return (
    <>
      <section className="heading">
        {edit ? <h1>Edit Event</h1>: <h1>Create Event</h1>}
      </section>
      
      <section className="form">
          <form onSubmit={ onSubmit }>
            
            <div className="formGroup">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" name="title" onChange={ onChange } value={ title }/>
            </div>

            <div className="formGroup">
              <label htmlFor="caption">Caption (max character: { captionLength })</label>
              <textarea type="text" name="caption" id="caption" rows={ 1 } value={ caption } onChange={ onChange } maxLength={ 50 }/>
            </div>

            <div className="formGroup">
              <label htmlFor="description">Description (min character: { descriptionLength })</label>
              <textarea type="text" name="description" id="description" rows={ 5 } value={ description } onChange={ onChange } minLength="150"/>
            </div>

            <div className="formGroup">
              <label htmlFor="dateTime">Date and Time</label>
              <input type="datetime-local" id="dateTime" name="dateTime" min={ date } onChange={ onChange } value={ dateTime }/>
            </div>

            <div className="formGroup">
              <label htmlFor="street">Street</label>
              <input type="text" id="street" name="street" onChange={ onChange } value={ street }/>
            </div>
            
            <div className="formGroup">
              <label htmlFor="city">City</label>
              <select name="city" id="city" defaultValue={ cities[0] } onChange={ onChange }>
                {
                  cities.map((city, i) => <option key={ i } value={ city }>{ city }</option>)
                }
              </select>
            </div>
            
            <div className="formGroup">
              <label htmlFor="maxAttendee">Maximum Number of Attendees (max: 20)</label>
              <input type="number" id="maxAttendee" name="maxAttendee" onChange={ onChange } max={ 20 } value={ maxAttendee }/>
            </div>

            <div className="formGroup">
              <label htmlFor="eventImage">Select an image less than 5MBs</label>
              <input id="eventImage" type="file" name="eventImage" onChange={ onSelectFile } className="form-input"/>
            </div>
            
            <div className="formGroup image-container">
              <img src={ selectedFile } className={ selectedFile ? "eventImagePreview" : "hide" } width={ 300 }  alt="preview" />
            </div>

            <div className="formGroup">
              <button className="btn" type="submit" disabled={ buttonDisable }>Submit</button>
            </div>
          </form>
      </section>
    </>
  )
}

export default EventForm
import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { createEvent, updateEvent } from "../features/events/eventSlice"
import Loading from "../components/Loading"
import { toast } from "react-toastify"

function EventForm() {

  const edit = localStorage.getItem("event") ? true : false
  
  let date = new Date()
  date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+ (date.getDate()+1) + "T" + date.getHours() + ":" + date.getMinutes()

  const eventObj = {
    title:"",
    caption:"",
    description: "",
    dateTime:"",
    street: "",
    city: "",
    state: "",
  }

  const { isPending } = useSelector((state) => state.events)

  const [formData, setFormData] = useState(localStorage.getItem("event") ? JSON.parse(localStorage.getItem("event")) : eventObj)
  const [selectedFile, setSelectedFile] = useState(localStorage.getItem("event") ? JSON.parse(localStorage.getItem("event")).imageUrl : "")
  const [captionLength, setCaptionLength] = useState("50");
  const [descriptionLength, setDescriptionLength] = useState("150");

  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { title, caption, description, dateTime, street, city, state } = formData

  const buttonDisable = title && caption && dateTime && selectedFile ? false : true
  
  const onChange = (e) => {

    if (e.target.id == "caption") {
      setCaptionLength(50 - e.target.value.length)
    }

    if (e.target.id == "description") {
      setDescriptionLength(150 - e.target.value.length)
    }

    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
    console.log(formData)
  }

  const onSelectFile = (e) => {
    const file = e.target.files[0];
    
    const fileSize = e.target.files.item(0).size
    const fileMb = fileSize / 1024 ** 2

    if (fileMb > 5) {
      toast.error("file too large")
      document.querySelector("#eventPic").value = ""
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
      // if it's in edit mode, then it should navigate back to the event page not the profile
      if (edit) {
        await dispatch(updateEvent({formData, selectedFile}))
      } else {
        await dispatch(createEvent({formData, selectedFile}))
      }
      navigate("/profile")
  }

  if (isPending) {
    return <Loading />
  }

  return (
    <>
      {edit? <h3>Edit Event</h3>: <h3>Create Event</h3>}
      
      <section className="form">
          <form onSubmit={onSubmit}>
              <label htmlFor="title">Title</label>
              <input type="text" id="title" name="title" onChange={ onChange } value={ title }/>

              <label htmlFor="caption">Caption character limit: {captionLength}</label>
                <input type="text" name="caption" id="caption" value={caption} onChange={onChange} maxLength={150}/>

              {/* <label htmlFor="description">Description</label>
              <input type="text" id="description" name="description" onChange={ onChange } value={ description }/> */}

              <label htmlFor="description">Description min character: {descriptionLength}</label>
              <input type="text" name="description" id="description" value={description} onChange={onChange} minLength={150}/>

              <label htmlFor="dateTime">Date and Time</label>
              <input type="datetime-local" id="dateTime" name="dateTime" min={date} onChange={ onChange } value={ dateTime }/>

              <label htmlFor="street">Street</label>
              <input type="text" id="street" name="street" onChange={ onChange } value={ street }/>

              <label htmlFor="city">City</label>
              <input type="text" id="city" name="city" onChange={ onChange } value={ city }/>
              
              <label htmlFor="eventPic">Select image less than 5mb</label>
              <input id="eventPic" type="file" name="image" onChange={ onSelectFile } className="form-input"/>

              <button type="submit" disabled={buttonDisable}>Submit</button>
          </form>
          <img src={selectedFile} className={selectedFile ? "image" : "hide"} width={300}  alt="preview image" />
      </section>
    </>
  )
}

export default EventForm
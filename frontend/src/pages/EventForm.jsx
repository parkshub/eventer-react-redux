import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createEvent, updateEvent } from '../features/events/eventSlice'
import Loading from '../components/Loading'
import { toast } from 'react-toastify'

function EventForm() {

  const edit = localStorage.getItem('event') ? true : false
  
  let date = new Date()
  date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+ (date.getDate()+1) + 'T' + date.getHours() + ':' + date.getMinutes()

  const eventObj = {
    title:'',
    caption:'',
    dateTime:'',
  }

  const { isPending } = useSelector((state) => state.events)

  const [formData, setFormData] = useState(localStorage.getItem('event') ? JSON.parse(localStorage.getItem('event')) : eventObj)
  const [selectedFile, setSelectedFile] = useState(localStorage.getItem('event') ? JSON.parse(localStorage.getItem('event')).imageUrl : '')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { title, caption, dateTime } = formData

  const buttonDisable = title && caption && dateTime && selectedFile ? false : true
  
  // console.log('this is the selectedFile', selectedFile.files.item(0).size)

  const onChange = (e) => {
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
};
  
  const onSubmit = async(e) => {
      e.preventDefault()
      // if it's in edit mode, then it should navigate back to the event page not the profile
      if (edit) {
        await dispatch(updateEvent({formData, selectedFile}))
        // await dispatch(updateEvent(formData))
      } else {
        // await dispatch(createEvent(formData))
        await dispatch(createEvent({formData, selectedFile}))
      }
      navigate('/profile')
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
              <input type="text" id='title' name='title' onChange={ onChange } value={ title }/>

              <label htmlFor="caption">Caption</label>
              <input type="text" id='caption' name='caption' onChange={ onChange } value={ caption }/>

              <label htmlFor="dateTime">Date and Time</label>
              <input type="datetime-local" id='dateTime' name='dateTime' min={date} onChange={ onChange } value={ dateTime }/>
              
              <label htmlFor="dateTime">Select image less than 5mb</label>
              <input id="fileInput" type="file" name="image" onChange={ onSelectFile } className="form-input"/>

              <button type='submit' disabled={buttonDisable}>Submit</button>
          </form>
          <img src={selectedFile} className={selectedFile ? 'image' : 'hide'} width={300}  alt="preview image" />
      </section>
    </>
  )
}

export default EventForm
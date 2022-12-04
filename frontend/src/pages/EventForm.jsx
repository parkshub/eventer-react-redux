import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createEvent, updateEvent } from '../features/events/eventSlice'

function EventForm() {

  const edit = localStorage.getItem('event') ? true : false

  const eventObj = {
    title:'',
    caption:''
  }

  const [formData, setFormData] = useState(JSON.parse(localStorage.getItem('event')) || eventObj)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { title, caption } = formData
  
  console.log(formData)

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
    console.log(formData)
  }
  
  const onSubmit = async(e) => {
      e.preventDefault()
      // if it's in edit mode, then it should navigate back to the event page not the profile
      if (edit) {
        await dispatch(updateEvent(formData))
      } else {
        await dispatch(createEvent(formData))
      }
      navigate('/profile')
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
              <button type='submit'>Submit</button>
          </form>
      </section>
    </>
  )
}

export default EventForm
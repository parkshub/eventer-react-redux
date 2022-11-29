import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import {createEvent} from '../features/events/eventSlice'

function EventForm() {

  const [formData, setFormData] = useState({
    title:'',
    caption: ''
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { title, caption } = formData

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
    console.log(formData, typeof(formData))
  }
  
  const onSubmit = (e) => {
      e.preventDefault()
      dispatch(createEvent(formData))
  }

  return (
    <>
      <h3>Create Event</h3>
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
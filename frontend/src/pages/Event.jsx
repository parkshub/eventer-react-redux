import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
// import { getEventPage } from '../features/events/eventService'
import { toast } from 'react-toastify'
import { reset, getEvent } from '../features/events/eventSlice'

function Event() {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { event, isPending, isRejected, isFulfilled, message } = useSelector((state) => state.events)
  const { user } = useSelector((state) => state.auth)
  
  useEffect(() => {
    dispatch(getEvent(location.state.id))
    console.log(event)

    return () => {
      dispatch(reset())
    }
  }, [dispatch])

  return (
    <>
      <div>Event</div>
      <div>{location.state.id}</div>
      <div>{event.title}</div>
      <div>{event.caption}</div>
      <div>attending: {event.attending}</div>
      <div>by: {event.user}</div>
      {user ? 
        <div>this shows up when user is logged in</div>
       : <div>this shows up when user is not logged in</div> }
    </>
  )
}

export default Event
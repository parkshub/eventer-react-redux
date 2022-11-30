import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { reset, getEvent, attendEvent } from '../features/events/eventSlice'

import Loading from '../components/Loading'

function Event() {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  
  const { event, isPending, isRejected, isFulfilled, message } = useSelector((state) => state.events)
  const { user } = useSelector((state) => state.auth)
  const [attendingState, setAttendingState] = useState(location.state.attending)
  const [attendeeState, setAttendeeState] = useState(location.state.attendee.map(x => Object.keys(x)).join(' ').split(' '))

  const [eventState, setEventState] = useState('')
  const onClick = () => {
    dispatch(attendEvent(location.state.id))
    setAttendingState((prev) => (prev+1))
    setAttendeeState((prev) => [...prev, user.id])
    
  }

  useEffect(() => {
    dispatch(getEvent(location.state.id))
    console.log('this is the event state', eventState)
    return () => {
      dispatch(reset())
    }
  }, [dispatch])


  if (isPending) {
    return <Loading/>
  }

  return (
    <>
      <div>Event</div>
      <div>{location.state.id}</div>
      <div>{event.title}</div>
      <div>{event.caption}</div>
      <div>attending: {attendingState}</div>
      <div>by: {event.user}</div>
      {/* Seeing if user is attending the event */}
      {attendeeState.includes(user.id) ? 
       <div>you're attending this event</div> :
       <button onClick={onClick}>Attend</button>
      }
      {user.id==event.user && 
      <button>delete event</button>
      }

    </>
  )
}

export default Event
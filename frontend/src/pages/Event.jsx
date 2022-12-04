import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { reset, getEvent, attendEvent, deleteEvent } from '../features/events/eventSlice'

import Loading from '../components/Loading'

function Event() {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  
  const { event, isPending } = useSelector((state) => state.events)
  const { user } = useSelector((state) => state.auth)
  
  const [eventState, setEventState] = useState(event || JSON.parse(localStorage.getItem('event')))
  
  //* MAKE SURE TO ERASE LOCAL STORAGE ON EXIT
  const attendeeArray = eventState.attendee.map(x => Object.keys(x)).join(' ').split(' ')
  
  const onClickAttend = () => {

    dispatch(attendEvent(eventState._id))

    const currUser = {[user.id]: user.name}
    const concatUsers = eventState.attendee.concat(currUser)

    setEventState((prev) => ({
      ...prev,
      attending: eventState.attending + 1,
      attendee: concatUsers
    }))
  }

  const onClickEdit = () => {
    navigate('/eventForm')
  }

  const onClickDelete = async() => {
    await dispatch(deleteEvent(eventState._id))
    navigate('/profile')
  }
  
  useEffect(() => {
    dispatch(getEvent(eventState._id))
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
      <div>{eventState._id}</div>
      <div>{eventState.title}</div>
      <div>{event.caption}</div>
      <div>attending: {eventState.attending}</div>
      <div>by: {eventState.user}</div>
      <div>these are ppl attending {JSON.stringify(eventState.attendee)}</div>
      {/* Seeing if user is attending the event */}
      
      {attendeeArray.includes(user.id) ? 
      <div>you're attending this event</div> :
      <button onClick={onClickAttend}>Attend</button>
      }

      {user.id === eventState.user && 
      <>
        <button onClick={onClickEdit}>Edit Event</button>
        <button onClick={onClickDelete}>Delete Event</button>
      </>
      }

    </>
  )
}

export default Event
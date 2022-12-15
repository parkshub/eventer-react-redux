import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { reset, getEvent, attendEvent, deleteEvent, unattendEvent } from '../features/events/eventSlice'
import { attendEventUser, unattendEventUser } from '../features/auth/authSlice'

import Loading from '../components/Loading'

function Event() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  
  const { event, isPending, isRejected, message } = useSelector((state) => state.events)
  const { user } = useSelector((state) => state.auth)
  
  const [eventState, setEventState] = useState(event || JSON.parse(localStorage.getItem('event')))

  localStorage.setItem('event', JSON.stringify(eventState))
  
  //* MAKE SURE TO ERASE LOCAL STORAGE ON EXIT
  const attendeeArray = eventState.attendee.map(x => Object.keys(x)).join(' ').split(' ')
  
  const onClickAttend = () => {

    dispatch(attendEvent(eventState._id))
    dispatch(attendEventUser(eventState._id)) 

    const currUser = {[user.id]: user.firstName}
    // const currUser = {[user.id]: user.name}
    const concatUsers = eventState.attendee.concat(currUser)

    setEventState((prev) => ({
      ...prev,
      attending: eventState.attending + 1,
      attendee: concatUsers
    }))
  }
  
  const onClickUnattend = async() => {
    
    dispatch(unattendEvent(eventState))
    dispatch(unattendEventUser(eventState._id))

    setEventState((prev) => ({
      ...prev,
      attendee: prev.attendee.filter(x => Object.keys(x)[0] !==user.id),
      attending: prev.attending - 1
    }))

    // localStorage.removeItem('event')
    
  }
  
  const onClickDelete = async() => {
    await dispatch(deleteEvent(eventState._id))
    navigate('/profile')
  }

  const onClickEdit = () => {
    navigate('/eventForm')
  }

  
  useEffect(() => {
    dispatch(getEvent(eventState._id))

    if (isRejected) {
      toast.error(message)
    }

    return () => {
      dispatch(reset())
    }
  }, [message ,isRejected ,dispatch])


  if (isPending) {
    return <Loading/>
  }

  return (
    <>
      <div>Event</div>
      <div>{eventState._id}</div>
      <div>{eventState.title}</div>
      <div>{event.caption}</div>
      <div>{eventState.dateTime}</div>
      <div>attending: {eventState.attending}</div>
      <div>created by: {eventState.userName}</div>
      <div>these are ppl attending {JSON.stringify(eventState.attendee)}</div>
      <img src={eventState.imageUrl} height={200} width={200} alt="" />
      {/* Seeing if user is attending the event */}

      {
        !attendeeArray.includes(user.id) // if user is not attending
          ? <button onClick={onClickAttend}>Attend</button> // show attend button
          : attendeeArray.includes(user.id) && user.id !== event.user  // if user is attending and is not the owner
            ? <button onClick={onClickUnattend}>Unattend</button> // show unattend button
            : user.id === eventState.user // if user is the event creater
              ? // show delete and edit buttons
              <>
                <button onClick={onClickEdit}>Edit Event</button>
                <button onClick={onClickDelete}>Delete Event</button>
              </>
              : ''
      }
    </>
  )
}

export default Event
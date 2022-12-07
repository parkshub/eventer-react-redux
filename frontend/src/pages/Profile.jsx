import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'


import { getUserEvents, reset } from '../features/events/eventSlice'
import {createEvent} from '../features/events/eventSlice'

import { getAttendingEvents } from '../features/events/eventSlice'

import Loading from '../components/Loading'
import EventItem from '../components/EventItem'


import EventForm from './EventForm'
import { toast } from 'react-toastify'


function Profile() {
  
  const { user } = useSelector((state) => state.auth)
  const { userEvents, attendingEvents, isPending, isRejected, message } = useSelector((state) => state.events)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const onClick= () => {
    localStorage.removeItem('event')
    navigate('/eventForm')
  }

  const testing = () => {
    console.log('these are attending events', attendingEvents)
    const output = attendingEvents.map(x => x)
    console.log(output)
  }
  
  useEffect(() => {

    if (isRejected) {
      toast.error(message)
    }

    dispatch(getUserEvents(user.id))
    dispatch(getAttendingEvents(user.attending))

    return () => (
      dispatch(reset())
    )
  }, [dispatch, isRejected, message])

  if (isPending) {
    return <Loading/>
  }

  return (
    <>
      <h1>Profile</h1>

      <button onClick={testing}>testing</button>

      <button onClick={onClick}>Create Event</button>
      
      <h2>Your Events</h2>

      { userEvents.length > 0 ?
      userEvents.map(userEvent => 
        <EventItem key={userEvent._id} event={userEvent}/>
        ) : 
        <div>you have no events. let's create an event!</div>
        }
      
      <h2>Events Your Attending</h2>

      { attendingEvents.length > 0
        ? <div> {attendingEvents.map((attendingEvent) => 
                <EventItem key={attendingEvent._id} event={attendingEvent}/>
                )}
          </div>
        : ''
      }

    </>
    // it should also include the events you are attending
  )
}

export default Profile
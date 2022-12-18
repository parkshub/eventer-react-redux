import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'


// import { getUserEvents, reset } from '../features/events/eventSlice'
import { reset, getProfileEvents } from '../features/events/eventSlice'
import {createEvent} from '../features/events/eventSlice'

// import { getAttendingEvents } from '../features/events/eventSlice'

import Loading from '../components/Loading'
import EventItem from '../components/EventItem'


import EventForm from './EventForm'
import { toast } from 'react-toastify'

import { createImageFromInitials } from '../components/Utils'


function Profile() {
  
  const { user } = useSelector((state) => state.auth)
  // const { events, userEvents, attendingEvents, isPending, isRejected, message } = useSelector((state) => state.events)
  const { events, isPending, isRejected, message } = useSelector((state) => state.events)

  const { attendingEvents, userEvents } = events

  console.log('these are the events', events)
  
  let imgSrc = ''

  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const onClick= () => {
    localStorage.removeItem('event')
    navigate('/eventForm')
  }

  useEffect(() => {

    dispatch(getProfileEvents(user.id))
    
    if (isRejected) {
      toast.error(message)
    }

    return () => (
      dispatch(reset())
    )
  }, [dispatch, isRejected, message])

  if (isPending) {
    return <Loading/>
  }

  return (
    <>

      {
        user.image.startsWith('#')
        ?
        <img id='preview' className='profileImage defaultPic' src={ imgSrc.length <= 0 ? createImageFromInitials(300, user.firstName + ' ' + user.lastName, user.image) : imgSrc } alt='profile-pic' />
        :
        <img src={user.image} alt="" className={'profileImage'}/>
      }

      <h1>Welcome to your profile, {user.firstName}</h1>

      <button onClick={onClick}>Create Event</button>
      
      <h2>Your Events</h2>

      {/* { userEvents.length > 0 ? */}
      { userEvents ?
      userEvents.map(userEvent => 
        <EventItem key={userEvent._id} event={userEvent}/>
        ) : 
        <div>you have no events. let's create an event!</div>
        }
      
      <h2>Events Your Attending</h2>

      { attendingEvents ?
         <div> {attendingEvents.filter(x => x.user !== user.id).map((attendingEvent) => 
                <EventItem key={attendingEvent._id} event={attendingEvent}/>
                )}
          </div>
        : ''
      }

    </>
  )
}

export default Profile
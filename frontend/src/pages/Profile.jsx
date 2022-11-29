import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'


import { getUserEvents, reset } from '../features/events/eventSlice'

import Loading from '../components/Loading'
import UserEventItem from '../components/EventItem'
import EventForm from '../components/EventForm'
import { toast } from 'react-toastify'


function Profile() {

  const { user } = useSelector((state) => state.auth)
  const { userEvents, isPending, isRejected, message } = useSelector((state) => state.events)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  
  useEffect(() => {

    if (isRejected) {
      toast.error(message)
    }

    dispatch(getUserEvents(user.id))

    return () => (
      dispatch(reset())
    )
  }, [dispatch, isRejected, message])

  if (isPending) {
    return <Loading/>
  }

  return (
    <>
      <h2>Profile</h2>

      <EventForm/>
      
      <h3>Your Events</h3>

      { userEvents.length > 0 ?
      userEvents.map(userEvent => 
        <UserEventItem key={userEvent.id} event={userEvent}/>
        ) : 
        <div>you have no events. let's create an event!</div>
        }
      
      <h3>Events Your Attending</h3>
    </>
    // it should also include the events you are attending
  )
}

export default Profile
import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'


import { getUserEvents } from '../features/events/eventSlice'

import { UserEventItem } from '../components/UserEventItem'

function Profile() {

  const { user } = useSelector((state) => state.auth)
  const { userEvents, isPending, isFulfilled, isRejected, message } = useSelector((state) => state.events)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getUserEvents(user.id))
  }, [dispatch])

  return (
    <>
      <div>Profile</div>
      {userEvents.map(userEvent => 
        <UserEventItem key={event.id} event={userEvent}/>
        )}
    </>
  )
}

export default Profile
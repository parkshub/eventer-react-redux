import React from 'react'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { useSelector } from 'react-redux'

import { reset } from '../features/events/eventSlice'

import Loading from '../components/Loading'

import { getAllEvents } from '../features/events/eventSlice'

import { toast } from 'react-toastify'

import EventItem from '../components/EventItem'


function AllEvents() {

  const dispatch = useDispatch()

  const { events, isPending, isRejected, message } = useSelector((state) => state.events)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {

    dispatch(getAllEvents())

    if (isRejected) {
      toast.error(message)
    }

    return () => {
      dispatch(reset())
    }
  }, [dispatch, isRejected, message])

  if (isPending) {
    return <Loading />
  }


    
  return (
    <>
      <div>AllEvents FIX LATER, WHEN COMING FROM PROFILE, DOES NOT WORK</div>
      {events !== '' ? 
        <div>
            {events.map((event) => 
                <EventItem key={event._id} event={event}/>
            )
            }
        </div>
      : (
        <h2>no events</h2>
      )
    }
  </>
  )
}

export default AllEvents
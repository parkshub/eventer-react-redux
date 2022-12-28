import React from "react"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useState } from "react"
import { useSelector } from "react-redux"

import { reset } from "../features/events/eventSlice"

import Loading from "../components/Loading"

import { getAllEvents } from "../features/events/eventSlice"

import { toast } from "react-toastify"

import EventItem from "../components/EventItem"
import { cities } from "../components/Utils"


function AllEvents() {

  const dispatch = useDispatch()

  const { events, isPending, isRejected, message } = useSelector((state) => state.events)
  const { user } = useSelector((state) => state.auth)

  const [eventState, setEventState] = useState(events || JSON.parse(localStorage.getItem("events")))

  const [eventFilter, setEventFilter] = useState("all")

  const onFilterChange = (e) => {
    setEventFilter(e.target.value)
  }

  const filterEvents = async(e) => {
    e.preventDefault()
    
    if (eventFilter === 'all') {
      setEventState(events || JSON.parse(localStorage.getItem("events")))
    } else {
      const filteredEvents = events.filter(x => x.city == eventFilter)
      setEventState(filteredEvents)
    }
  }

  useEffect(() => {

    if (events==="") {
      dispatch(getAllEvents())
    }

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
      <form onSubmit={ filterEvents }>

        <label htmlFor="city">Filter by City</label>
        <select name="city" id="city" defaultValue="" onChange={ onFilterChange }>
          <option value="all">Show All</option>
          {
            cities.map((city, i) => <option key={ i } value={ city }>{ city }</option>)
          }
        </select>

        <button type="submit">Filter</button>
      </form>
      {/* {events ?
        <div>
            {events.map((event) => 
                <EventItem key={event._id} event={event}/>
            )
            }
            these are events
        </div>
      : (
        <h2>no events</h2>
      )
    } */}
      {eventState ?
        <div>
            {eventState.map((event) => 
                <EventItem key={event._id} event={event}/>
            )
            }
            these are events
        </div>
      : (
        <h2>no events</h2>
      )
    }
  </>
  )
}

export default AllEvents
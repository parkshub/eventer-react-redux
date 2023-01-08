import React from "react"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { reset, getAllEvents } from "../features/events/eventSlice"

import Loading from "../components/Loading"
import EventItem from "../components/EventItem"
import { cities } from "../components/Utils"

import { toast } from "react-toastify"

function AllEvents() {

  const dispatch = useDispatch()

  const { events, isPending, isRejected, message } = useSelector((state) => state.events)
  // const { user } = useSelector((state) => state.auth)

  // const [eventState, setEventState] = useState(events || JSON.parse(localStorage.getItem("events")))

  const [eventFilter, setEventFilter] = useState("all")

  const onFilterChange = (e) => {
    setEventFilter(e.target.value)
  }

  // const filterEvents = async(e) => {
  //   e.preventDefault()
    
  //   // if (eventFilter === 'all') {
  //     // setEventState(events || JSON.parse(localStorage.getItem("events")))
  //   // } else {
  //     const filteredEvents = events.filter(x => x.city === eventFilter)
  //     // setEventState(filteredEvents)
  //   }
  

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
      <section className="form">
        <form>
          <div className="formGroup">
          <label htmlFor="city">Filter by City</label>
            <select name="city" id="city" defaultValue="" onChange={ onFilterChange }>
              <option value="all">Show All</option>
              {
                cities.map((city, i) => <option key={ i } value={ city }>{ city }</option>)
              }
            </select>
          </div>
        </form>
      </section>

      <section className="content">
        {events ?
          <ul className="events">
              {events.filter((filteredEvent) => eventFilter === "all" ? filteredEvent : filteredEvent.city === eventFilter).map((event) =>  
                  <EventItem key={event._id} event={event}/>
              )}
          </ul> :
          (
            <h2>no events</h2>
          )
        }
      </section>
    </>
  )
}

export default AllEvents
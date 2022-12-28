import React, {useState, useEffect} from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { reset, resetHomeEvents, getHomeEvents } from "../features/events/eventSlice"

import Loading from "../components/Loading"
import EventItem from "../components/EventItem"

import { getEvent } from "../features/events/eventSlice"

function Home () {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { homeEvents, events, isPending, isRejected, message } = useSelector((state) => state.events)
    
    useEffect(() => {
        
        dispatch(getHomeEvents())
        if (isRejected) {
            console.log("was rejected")
            toast.error(message)
        }
        
        return () => {
            console.log("it reset home events")
            dispatch(resetHomeEvents())
        }

    }, [dispatch])

    if (isPending) {
        return <Loading />
    }

    return (
        <>
            <section className="heading">
                <h1>Top Events</h1>
            </section>
            
            <section className="content">
                {homeEvents.length > 0 ? 
                    <div className="events">
                        {homeEvents.map((homeEvent) => 
                            <EventItem key={homeEvent._id} event={homeEvent}/>
                        )
                        }
                    </div>
                    : (
                    <h2>no events</h2>
                )}
                <h4>Login or Signup to see more events!</h4>
            </section>
        </>

        
    )
}

export default Home
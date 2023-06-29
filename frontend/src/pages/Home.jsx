import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { resetHomeEvents, getHomeEvents } from "../features/events/eventSlice"

import Loading from "../components/Loading"
import EventItem from "../components/EventItem"


function Home () {
    const dispatch = useDispatch()

    const { homeEvents, isPending, isRejected, message } = useSelector((state) => state.events)
    const { user } = useSelector((state) => state.auth)
    
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
                {!user ? <p>Login or signup to attend and see more events!</p> : <p>Create or attend events in California!</p>}
            </section>
            <section className="content-body">
                <section className="content">
                    {
                        // homeEvents.length > 0 
                        // ? 
                        // <ul className="events">
                        //     {homeEvents.map((homeEvent) => 
                        //         <EventItem key={homeEvent._id} event={homeEvent}/>
                        //     )
                        //     }
                        // </ul>
                        // : 
                        // (<h2>no events</h2>)
                        JSON.stringify(homeEvents) === "[]" 
                        ?
                        <p className="noEventMsg"> <u><i>there are no events</i></u> </p>
                        :
                            homeEvents
                            ?
                            <ul className="events">
                                {homeEvents.map((homeEvent) => {
                                    if (new Date(homeEvent.dateTime) > new Date()) {
                                        return <EventItem key={homeEvent._id} event={homeEvent}/>
                                    }
                                })}
                            </ul>
                            :
                            ""
                    }
                </section>
            </section>
        </>

        
    )
}

export default Home
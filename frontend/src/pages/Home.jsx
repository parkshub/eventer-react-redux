import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { reset, resetHomeEvents, getHomeEvents } from '../features/events/eventSlice'

import Loading from '../components/Loading'
import EventItem from '../components/EventItem'

import { getEvent } from '../features/events/eventSlice'

function Home () {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { homeEvents, event, isPending, isRejected, message } = useSelector((state) => state.events)

    
    useEffect(() => {
        
        dispatch(getHomeEvents())
        if (isRejected) {
            console.log('was rejected')
            toast.error(message)
        }
        
        return () => {
            console.log('it reset home events')
            dispatch(resetHomeEvents())
        }

    }, [dispatch])

    if (isPending) {
        return <Loading />
    }

    return (
        <section>
            <h3>Top Events</h3>
            {homeEvents.length > 0 ? 
                <div>
                    {homeEvents.map((homeEvent) => 
                        <EventItem key={homeEvent._id} event={homeEvent}/>
                    )
                    }
                </div>
             : (
                <h2>no events</h2>
            )}
            <div>so what i can do with profile pics is...see if they have a link or color and if they have a color output a div with class profileImage but if they have a link, out an img with src class profileImage...things to do next, editing profile name and pic.
            </div>
        </section>

        
    )
}

export default Home
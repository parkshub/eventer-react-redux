import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { reset, getHomeEvents } from '../features/events/eventSlice'

import Loading from '../components/Loading'
import HomeEventItem from '../components/HomeEventItem'

function Home () {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { events, isPending, isRejected, isFulfilled, message } = useSelector((state) => state.events)

    const test = events
    console.log('this is the test', test, Array.isArray(test))

    const onClick = (e) => {
        // console.log(e.target.getAttribute('data-index'))
        // console.log(e.target.getAttribute('data-index'))
        console.log('twas clicked-->', e)
    }

    useEffect(() => {
        dispatch(getHomeEvents())

        if (isRejected) {
            console.log('was rejected')
            toast.error(message)
        }

        if (isFulfilled) {
            console.log('was fulfilled')
            // console.log('these are the events--->'+ events.event)
        }

        // return () => {
        //     console.log('it reset')
        //     dispatch(reset())
        // }
    }, [isRejected, isFulfilled, message, dispatch])

    if (isPending) {
        console.log('was loading')
        return <Loading />
    }

    return (
        <section>
            <h3>Top Events</h3>
            {events.length > 0 ? 
                <div>
                    {events[0].map((event) => 
                        <HomeEventItem key={event._id} event={event} onClick={onClick}/>
                    )
                    }
                </div>
             : (
                <h2>no events</h2>
            )}
        </section>

        
    )
}

export default Home
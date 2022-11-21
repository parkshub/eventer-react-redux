import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { toast } from 'react-toastify'
import Loading from '../components/Loading'
import { reset, getHomeEvents } from '../features/events/eventSlice'

function Home () {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { events, isPending, isRejected, isFulfilled, message } = useSelector((state) => state.events)

    console.log('here' + events, isPending, isFulfilled, isRejected)

    useEffect(() => {
        console.log('first' + isFulfilled + isPending + isRejected)
        // if (isRejected) {
        //     console.log('was rejected')
        //     toast.error(message)
        // }

        // if (isFulfilled) {
        console.log('was fulfilled')
        dispatch(getHomeEvents())
        console.log('these are the events--->'+ events)
        // }

        // return () => {
        //     console.log('it reset')
        //     dispatch(reset())
        // }
    }, [isRejected, isFulfilled, message, dispatch])

    if (isPending) {
        console.log('was lading')
        return <Loading />
    }

    return (
        <>
            <h1>hello world</h1>
            <section>
                {events}
            </section>
        </>
        
    )
}

export default Home
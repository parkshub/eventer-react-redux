import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { reset, resetHomeEvents, getHomeEvents } from '../features/events/eventSlice'

import Loading from '../components/Loading'
import HomeEventItem from '../components/HomeEventItem'

import { getEvent } from '../features/events/eventSlice'

function Home () {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { homeEvents, event, isPending, isRejected, isFulfilled, message } = useSelector((state) => state.events)

    
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


    const onClick = async(e) => {
        // console.log('it was i', e.target.value)
        await dispatch(getEvent(e.target.value))
        navigate('/event')
    }


    return (
        <section>
            <h3>Top Events</h3>
            {homeEvents.length > 0 ? 
                <div>
                    {homeEvents[0].map((homeEvent) => 
                        <HomeEventItem key={homeEvent._id} event={homeEvent} onClick={onClick}/>
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
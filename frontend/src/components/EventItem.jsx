import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { getEvent } from '../features/events/eventSlice'


function EventItem({event}) {

    const { user } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onClick = async(e) => {
        await dispatch(getEvent(e.target.value))
        navigate('/event')
    }

    return (
        <>
            <div className="eventItem">
                <h3>{event._id}</h3>
                <h4 className='eventName'>{event.title}</h4>
                <p className='eventCaption'>{event.caption}</p>
                <span className='attending'>{event.attending} attending</span>
            </div>
            { user ? 
            <button value={event._id} onClick={onClick}>View</button> :
            ''
            }
        </>
    )
}

export default EventItem
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'


// import getEvent from '../features/events/eventSlice'


function HomeEventItem({event, onClick}) {
    console.log('this is the event-->', event._id)

    const { user } = useSelector((state) => state.auth)
    console.log('this is the event', event)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // dispatch(getEvent(event._id))

    // const onClick = (e) => {
    //     dispatch(getEvent(event.id))
    //     navigate('/event')
    // }

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

export default HomeEventItem
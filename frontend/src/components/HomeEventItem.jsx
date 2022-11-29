import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'

function HomeEventItem({event}) {
    console.log('this is the event-->', event._id)

    const { user } = useSelector((state) => state.auth)

    const navigate = useNavigate()

    const onClick = (e) => {

        console.log('it was I', event._id)
        navigate('/event', {
            state: {id: event._id}
        })
    }

    console.log('here++>', event)
    return (
        <>
            <div className="eventItem">
                <h4 className='eventName'>{event.title}</h4>
                <p className='eventCaption'>{event.caption}</p>
                <span className='attending'>{event.attending} attending</span>
            </div>
            <button onClick={onClick}>View</button>
        </>
    )
}

export default HomeEventItem
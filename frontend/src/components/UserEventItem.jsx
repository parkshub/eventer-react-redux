import React from 'react'
import { useNavigate, Link } from 'react-router-dom'

function UserEventItem ({event}) {

    const onClick = (e) => {

    }

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

export default UserEventItem
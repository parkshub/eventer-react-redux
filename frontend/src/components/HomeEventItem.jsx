import React from 'react'

function HomeEventItem({event}) {
    console.log('this is the event-->', event._id)
    const onClick = (e) => {
        console.log(event._id)
        // make a function to dispatch and navigate

    }

    console.log('here++>', event)
    return (
        <>
            <div className="eventItem">
                <h4 className='eventName'>{event.title}</h4>
                <p className='eventCoption'>{event.caption}</p>
                <span className='attending'>{event.attending} attending</span>
            </div>
            <button onClick={onClick}>View</button>
        </>
    )
}

export default HomeEventItem
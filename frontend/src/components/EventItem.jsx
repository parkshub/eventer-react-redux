import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { getEvent } from "../features/events/eventSlice"
import { formatDate } from "../components/Utils"


function EventItem({event}) {

    const { user } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onClick = async(e) => {
        await dispatch(getEvent(e.target.value))
        navigate("/event")
    }

    const {formattedDate, formattedTime} = formatDate(event.dateTime)

    return (
        <li className="event">
            <figure>
                <img className="eventThumbnail" src={event.imageUrl} alt="" />
                <figcaption>
                    <h3 className="eventName">{event.title}</h3>
                </figcaption>
            </figure>
            {/* <h3 className="eventName">{event.title}</h3> */}
            <p className="eventCaption">"{event.caption}"</p>
            <p className="attending">Date & Time: {formattedDate + " " + formattedTime}</p>
            <p className="location">Location: {event.street}, {event.city}, California </p>
            <p className="attending">{event.attending}/{event.maxAttendee} attending</p>
            { user ? 
                <button className="btn" value={event._id} onClick={onClick}>View Event</button> :
                ""
            }
        </li>
    )
}

export default EventItem
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
        <>
            <div className="eventItem">
                <img src={event.imageUrl} width={250} height={250} alt="" />
                {/* <img src={event.imageUrl} alt="" /> */}
                <h3>{event._id}</h3>
                <h4 className="eventName">{event.title}</h4>
                <p className="eventCaption">{event.caption}</p>
                <p className="attending">Date & Time: {formattedDate + " " + formattedTime}</p>
                <p className="attending">{event.attending}/{event.maxAttendee} attending</p>
                <p className="location">Location: {event.street}, {event.city}, California </p>
            </div>
            { user ? 
            <button value={event._id} onClick={onClick}>View</button> :
            ""
            }
        </>
    )
}

export default EventItem
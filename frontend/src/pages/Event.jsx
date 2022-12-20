import React, {useState, useEffect} from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"
import { toast } from "react-toastify"
import { reset, getEvent, attendEvent, deleteEvent, unattendEvent } from "../features/events/eventSlice"
import { attendEventUser, unattendEventUser } from "../features/auth/authSlice"
import { createImageFromInitials } from "../components/Utils"
import Loading from "../components/Loading"

import { getVisitingProfile } from "../features/events/eventSlice"

function Event() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  
  const { event, isPending, isRejected, message } = useSelector((state) => state.events)
  const { user } = useSelector((state) => state.auth)
  
  const [eventState, setEventState] = useState(event || JSON.parse(localStorage.getItem("event")))

  console.log(eventState)

  localStorage.setItem("event", JSON.stringify(eventState))
  
  //* MAKE SURE TO ERASE LOCAL STORAGE ON EXIT
  const attendeeArray = eventState.attendee.map(x => Object.keys(x)).join(" ").split(" ")
  let imgSrc = ""

  const onClickAttend = () => {

    dispatch(attendEvent(eventState._id))
    dispatch(attendEventUser(eventState._id)) 

    const currUser = {[user.id]: 
      {
        name: user.firstName,
        image: user.image,
      }}
    const concatUsers = eventState.attendee.concat(currUser)

    setEventState((prev) => ({
      ...prev,
      attending: eventState.attending + 1,
      attendee: concatUsers
    }))
  }
  
  const onClickUnattend = async() => {
    
    dispatch(unattendEvent(eventState))
    dispatch(unattendEventUser(eventState._id))

    setEventState((prev) => ({
      ...prev,
      attendee: prev.attendee.filter(x => Object.keys(x)[0] !==user.id),
      attending: prev.attending - 1
    }))    
  }
  
  const onClickDelete = async() => {
    await dispatch(deleteEvent(eventState._id))
    navigate("/profile")
  }

  const onClickEdit = () => {
    navigate("/eventForm")
  }

  const onClickProfile = (e) => {
    console.log(e.target.id)
    dispatch(getVisitingProfile(e.target.id))
    navigate("/visitorsProfile")
  }

  
  useEffect(() => {
    dispatch(getEvent(eventState._id))

    if (isRejected) {
      toast.error(message)
    }

    return () => {
      dispatch(reset())
    }
  }, [message ,isRejected ,dispatch])


  if (isPending) {
    return <Loading/>
  }

  return (
    <>
      <div>Event</div>
      <div>{eventState._id}</div>
      <div>{eventState.title}</div>
      <div>{event.caption}</div>
      <div>{eventState.dateTime}</div>
      <div>attending: {eventState.attending}</div>
      <div>created by: {eventState.userName}</div>
      <div>these are ppl attending {JSON.stringify(eventState.attendee)}</div>

      <div>these are ppl attending 
        {eventState.attendee.map((x, i) => 
          Object.values(x)[0].image.startsWith("#") ?
            <img key={Object.keys(x)[0]} id={Object.keys(x)[0]} className={i==0 ? "profileImage defaultPic hostPic" : "profileImage defaultPic"} src={ imgSrc.length <= 0 ? createImageFromInitials(300, Object.values(x)[0].name, Object.values(x)[0].image) : imgSrc } alt="profile-pic" onClick={onClickProfile}/> :
            <img key={Object.keys(x)[0]} id={Object.keys(x)[0]} className={i==0 ? "profileImage defaultPic hostPic" : "profileImage defaultPic"} src={Object.values(x)[0].image} alt="" onClick={onClickProfile}/>
        )
        }
      </div>

      <img src={eventState.imageUrl} height={200} width={200} alt="" />
      {/* Seeing if user is attending the event */}

      {
        !attendeeArray.includes(user.id) // if user is not attending
          ? <button onClick={onClickAttend}>Attend</button> // show attend button
          : attendeeArray.includes(user.id) && user.id !== event.user  // if user is attending and is not the owner
            ? <button onClick={onClickUnattend}>Unattend</button> // show unattend button
            : user.id === eventState.user // if user is the event creater
              ? // show delete and edit buttons
              <>
                <button onClick={onClickEdit}>Edit Event</button>
                <button onClick={onClickDelete}>Delete Event</button>
              </>
              : ""
      }
    </>
  )
}

export default Event
import React, {useState, useEffect} from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { reset, getEvent, attendEvent, deleteEvent, unattendEvent, getVisitingProfile } from "../features/events/eventSlice"

import { attendEventUser, unattendEventUser } from "../features/auth/authSlice"
import { createImageFromInitials } from "../components/Utils"

import { formatDate } from "../components/Utils"


function Event() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  
  const { event, isRejected, message } = useSelector((state) => state.events)
  const { user } = useSelector((state) => state.auth)
  
  const [eventState, setEventState] = useState(event || JSON.parse(localStorage.getItem("event")))
  
  const attendeeArray = eventState.attendee.map(x => Object.keys(x)).join(" ").split(" ")
  let imgSrc = ""

  const { formattedDate, formattedTime } = formatDate(eventState.dateTime)
  console.log(eventState.attending)

  const overflow = eventState.attending > 3 ? true : false
  const overflowVal = `+ ${String(eventState.attending - 3)}`

  console.log(eventState)

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
    if (e.target.id === user.id) {
      return
    }
    else if (e.target.id === "overflowImage") {
      const docs = document.querySelectorAll('.overflown')
      docs.forEach(x => x.classList.toggle('hide'))
    } else {
    dispatch(getVisitingProfile(e.target.id))
    navigate("/visitorsProfile")
    }
  }

  const onClickShowLess = () => {
    const docs = document.querySelectorAll('.overflown')
    docs.forEach(x => x.classList.toggle('hide'))
  }

  
  useEffect(() => {
    // if (event === "") {
      dispatch(getEvent(eventState._id))
    // }

    if (isRejected) {
      toast.error(message)
    }

    return () => {
      // localStorage.removeItem('event')
      dispatch(reset())
    }
  }, [message ,isRejected ,dispatch])


  // if (isPending) {
  //   return <Loading/>
  // }

  return (
    <>
      <section className="heading">
        <h1>Event Name: {eventState.title}</h1>
        <p>Hosted by: {eventState.userName}</p>
      </section>

      <section className="content-body">
      
        <section className="event">
          <section className="image-container">
            <img src={eventState.imageUrl} alt="" />
          </section>
          <section className="event-text-container">
            <p><b>Description: </b>{eventState.description}</p>
            <p><b>Date & Time: </b>{formattedDate + " " + formattedTime}</p>
            <p><b>{eventState.attending}/{eventState.maxAttendee} Attending</b></p>
            <p><b>Attendees</b></p>
          </section>

          <div className="profile-image-container">
            <div className="image-item">
            {eventState.attendee.map((x, i) => 
              Object.values(x)[0].image.startsWith("#") ?

                <img key={Object.keys(x)[0]} id={Object.keys(x)[0]} className={i===0 ? "profileImage hostPic hover" : i > 2 ? "profileImage hover hide overflown" : "profileImage hover"} src={ imgSrc.length <= 0 ? createImageFromInitials(300, Object.values(x)[0].name, Object.values(x)[0].image) : imgSrc } alt="profile-pic" onClick={onClickProfile}/>
                 :

                <img key={Object.keys(x)[0]} id={Object.keys(x)[0]} className={i===0 ? "profileImage hostPic hover" : i > 2 ? "profileImage hover hide overflown" : "profileImage hover"} src={Object.values(x)[0].image} alt="" onClick={onClickProfile}/>
            )
            }
            {
            overflow ? <img id="overflowImage" className="profileImage overflowImage hover overflown" src={ imgSrc.length <= 0 ? createImageFromInitials(300, overflowVal, "#00ffff") : imgSrc } alt="" onClick={onClickProfile}/>: ""
            }
            <div className="btn-container">
              <button className="btn overflown hide" onClick={onClickShowLess}>show less</button>
            </div>
            </div>



          </div>

          {
            user.id === eventState.user ?// if user is the event creator
              <div className="btn-container">
                <button className="btn" onClick={onClickEdit}>Edit Event</button>
                <button className="btn" onClick={onClickDelete}>Delete Event</button>
              </div> :
              attendeeArray.includes(user.id) ?
                <button className="btn" onClick={onClickUnattend}>Unattend</button> :
                eventState.maxAttendee === eventState.attending ?
                  <h3>Event is currently full</h3> :
                  !attendeeArray.includes(user.id) ?
                    <button className="btn" onClick={onClickAttend}>Attend</button> :
                    ""
          }
        </section>
      </section>
    </>
  )
}

export default Event
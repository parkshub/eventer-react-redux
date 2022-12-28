import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, Link } from "react-router-dom"


// import { getUserEvents, reset } from "../features/events/eventSlice"
import { reset, getProfileEvents } from "../features/events/eventSlice"
import {createEvent} from "../features/events/eventSlice"

// import { getAttendingEvents } from "../features/events/eventSlice"

import Loading from "../components/Loading"
import EventItem from "../components/EventItem"


import EventForm from "./EventForm"
import { toast } from "react-toastify"

import { createImageFromInitials } from "../components/Utils"


function Profile() {
  
  const { user } = useSelector((state) => state.auth)
  const { profileEvents, isPending, isRejected, message } = useSelector((state) => state.events)
  
  const { attendingEvents, userEvents } = profileEvents

  let imgSrc = ""

  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const onClick= () => {
    localStorage.removeItem("event")
    navigate("/eventForm")
  }

  const onClickEdit = () => {
    navigate("/profileForm")
  }

  useEffect(() => {

    dispatch(getProfileEvents(user.id))
    
    if (isRejected) {
      toast.error(message)
    }

    return () => (
      dispatch(reset())
    )
  }, [dispatch, isRejected, message])

  if (isPending) {
    return <Loading/>
  }

  return (
    <>
      <section className="heading">
        <h1>Welcome to your profile, {user.firstName}</h1>
        {
          user.image.startsWith("#")
          ?
          <img id="preview" className="profileImage defaultPic" src={ imgSrc.length <= 0 ? createImageFromInitials(300, user.firstName + " " + user.lastName, user.image) : imgSrc } alt="profile-pic" />
          :
          <img src={user.image} alt="" className={"profileImage"}/>
        }

      </section>


        <h3>Bio</h3>
        <h4>{user.bio}</h4>

        <ul>
          <li>
            <button className="btn" onClick={onClickEdit}>Edit Profile</button>
          </li>

          <li>
            <button className="btn" onClick={onClick}>Create Event</button>
          </li>
        </ul>

      
      
      <h3>Your Events</h3>

      <section className="content">
        { userEvents ?
        <div className="events">
          {userEvents.map(userEvent => 
            <EventItem key={userEvent._id} event={userEvent}/>
          )}
        </div>
          : 
          <div>you have no events. let's create an event!</div>
        }
      </section>
      
      <h3>Events Your Attending</h3>

      <section className="content">
        { attendingEvents ?
          <div className="events"> 
            {attendingEvents.filter(x => x.user !== user.id).map((attendingEvent) => 
              <EventItem key={attendingEvent._id} event={attendingEvent}/>
            )}
          </div>
          : ""
        }
      </section>

    </>
  )
}

export default Profile
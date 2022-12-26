import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"


import { reset, getProfileEvents } from "../features/events/eventSlice"


import Loading from "../components/Loading"
import EventItem from "../components/EventItem"

import { toast } from "react-toastify"

import { createImageFromInitials } from "../components/Utils"

import { getUserInfo } from "../features/auth/authSlice"


function VisitorsProfile() {
  
  // const { events, isPending, isRejected, message } = useSelector((state) => state.events)
  const { profileEvents, isPending, isRejected, message } = useSelector((state) => state.events)

  const {user, visitingUser} = useSelector((state) => state.auth)

  // const { attendingEvents, userEvents } = events
  const { attendingEvents, userEvents } = profileEvents

  const visitingProfile = JSON.parse(localStorage.getItem("visitingProfile"))

  // console.log("these are the events", events)
  
  let imgSrc = ""
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  
  useEffect(() => {
    
    dispatch(getProfileEvents(visitingProfile))
    dispatch(getUserInfo(visitingProfile))

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

    {
      visitingUser && visitingUser.image.startsWith("#")
      ?
      <img id="preview" className="profileImage defaultPic" src={ imgSrc.length <= 0 ? createImageFromInitials(300, visitingUser.firstName + " " + visitingUser.lastName, visitingUser.image) : imgSrc } alt="profile-pic" />
      :
      <img src={visitingUser.image} alt="" className={"profileImage"}/>
    }

    <h1>Welcome to {visitingUser.firstName}'s profile</h1>

    <h2>Bio</h2>
    <h3>{visitingUser.bio}</h3>
    
    <h2>Events {visitingUser.firstName} is Hosting</h2>

    {/* { userEvents.length > 0 ? */}
    { userEvents ?
    userEvents.map(userEvent => 
      <EventItem key={userEvent._id} event={userEvent}/>
      ) : 
      <div>you have no events. let's create an event!</div>
      }
    
    <h2>Events {visitingUser.firstName} is Attending</h2>

    { attendingEvents ?
       <div> {attendingEvents.filter(x => x.user !== user.id).map((attendingEvent) => 
              <EventItem key={attendingEvent._id} event={attendingEvent}/>
              )}
        </div>
      : ""
    }

  </>
)
  
}

export default VisitorsProfile
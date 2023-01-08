import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { reset, getProfileEvents } from "../features/events/eventSlice"
import Loading from "../components/Loading"
import EventItem from "../components/EventItem"
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
        <h1>Profile</h1>
        <p>Welcome to your profile, {user.firstName}</p>
        {
          user.image.startsWith("#")
          ?
          <img className="profileImage" src={ imgSrc.length <= 0 ? createImageFromInitials(300, user.firstName + " " + user.lastName, user.image) : imgSrc } alt="profile-pic" />
          :
          <img src={user.image} alt="" className="profileImage"/>
        }

      </section>

      <section className="content-main">
        <p>"{user.bio}"</p>

        <ul className="content-main-item">
          <li>
            <button className="btn" onClick={onClickEdit}>Edit Profile</button>
          </li>

          <li>
            <button className="btn" onClick={onClick}>Create Event</button>
          </li>
        </ul>
      </section>

      <section className="content-body">
      
        <h3>Your Events</h3>

        <section className="content">
          { userEvents ?
          <ul className="events">
            {userEvents.map(userEvent => 
              <EventItem key={userEvent._id} event={userEvent}/>
            )}
          </ul>
            : 
            <div>you have no events. let's create an event!</div>
          }
        </section>
        
        <h3>Events You're Attending</h3>

        <section className="content">
          { attendingEvents ?
            <ul className="events"> 
              {attendingEvents.filter(x => x.user !== user.id).map((attendingEvent) => 
                <EventItem key={attendingEvent._id} event={attendingEvent}/>
              )}
            </ul>
            : ""
          }
        </section>
      </section>

    </>
  )
}

export default Profile
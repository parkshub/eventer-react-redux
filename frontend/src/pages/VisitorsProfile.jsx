import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import Loading from "../components/Loading"
import EventItem from "../components/EventItem"
import { reset, getProfileEvents } from "../features/events/eventSlice"
import { getUserInfo } from "../features/auth/authSlice"
import { createImageFromInitials } from "../components/Utils"
import { toast } from "react-toastify"




function VisitorsProfile() {
  
  const { profileEvents, isPending, isRejected, message } = useSelector((state) => state.events)
  const { user, visitingUser } = useSelector((state) => state.auth)

  const { attendingEvents, userEvents } = profileEvents

  const visitingProfile = JSON.parse(localStorage.getItem("visitingProfile"))
  
  let imgSrc = ""

  const dispatch = useDispatch()
    
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
      <section className="heading">
        <h1>Visitor's Profile Page</h1>
        <p>Welcome to <u><i>{visitingUser.firstName}</i></u>'s profile</p>
        {
          visitingUser && visitingUser.image.startsWith("#")
          ?
          <img id="preview" className="profileImage defaultPic" src={ imgSrc.length <= 0 ? createImageFromInitials(300, visitingUser.firstName + " " + visitingUser.lastName, visitingUser.image) : imgSrc } alt="profile-pic" />
          :
          <img src={ visitingUser.image } alt="" className={ "profileImage" }/>
        }
      </section>

      <section className="content-main">
        <p>"{ visitingUser.bio }"</p>
      </section>
      
      <section className="content-body">
        <h3>Events <u><i>{ visitingUser.firstName }</i></u> is Hosting</h3>
        <section className="content">
          { 
            JSON.stringify(userEvents) === "[]" 
            ?
            <p className="noEventMsg">no events</p> 
            :
              userEvents 
              ?
              <ul className="events">
                {userEvents.map(userEvent => 
                  <EventItem key={userEvent._id} event={ userEvent }/>
                )}
              </ul> 
              : 
              ""
          }
        </section>
        
        <h3>Events <u><i>{ visitingUser.firstName }</i></u> is Attending</h3>
        
        <section className="content">
          { 
            JSON.stringify(attendingEvents) === "[]" 
            ? 
            <p className="noEventMsg">no events</p> 
            :
              attendingEvents 
              ?
              <ul className="events">
                {attendingEvents.map(attendingEvent => 
                  <EventItem key={ attendingEvent._id } event={ attendingEvent }/>
                )}
              </ul> 
              : 
              ""
          }
        </section>
      </section>
    </>
  )
}

export default VisitorsProfile
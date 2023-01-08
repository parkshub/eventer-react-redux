import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import Loading from "../components/Loading"
import EventItem from "../components/EventItem"
import { reset, getProfileEvents } from "../features/events/eventSlice"
import { getUserInfo } from "../features/auth/authSlice"
import { createImageFromInitials } from "../components/Utils"
import { toast } from "react-toastify"




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
        <p>Welcome {visitingUser.firstName}'s to profile</p>
        {
          visitingUser && visitingUser.image.startsWith("#")
          ?
          <img id="preview" className="profileImage defaultPic" src={ imgSrc.length <= 0 ? createImageFromInitials(300, visitingUser.firstName + " " + visitingUser.lastName, visitingUser.image) : imgSrc } alt="profile-pic" />
          :
          <img src={visitingUser.image} alt="" className={"profileImage"}/>
        }
      </section>

      <section className="content-main">
        <p>"{visitingUser.bio}"</p>
      </section>
      
      <section className="content-body">
        { userEvents? <h3>Events {visitingUser.firstName} is Hosting</h3> : <div>no events</div>}
        {/* <h3>Events {visitingUser.firstName} is Hosting</h3> */}
        <section className="content">
            { userEvents ? 
              <ul className="events">
                {userEvents.map(userEvent => 
                  <EventItem key={userEvent._id} event={userEvent}/>
                )} 
              </ul> : 
              <div>No events</div>
            }
        </section>
        
        <h3>Events {visitingUser.firstName} is Attending</h3>
        
        <section className="content">
          { attendingEvents ?
            <ul className="events"> 
              {attendingEvents.filter(x => x.user !== user.id).map((attendingEvent) => 
                <EventItem key={attendingEvent._id} event={attendingEvent}/>
              )}
            </ul> :
            <div>No events</div>
          }
        </section>
      </section>
    </>
  )
}

export default VisitorsProfile
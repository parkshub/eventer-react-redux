import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import "./App.css";
import Home from "./pages/Home"
import Header from "./components/Header"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Event from "./pages/Event"
import Profile from "./pages/Profile"
import EventForm from "./pages/EventForm";
import AllEvents from "./pages/AllEvents";
import VisitorsProfile from "./pages/VisitorsProfile";
import ProfileForm from "./pages/ProfileForm";
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function App() {
  return (
    <>
      <Router>
        <Header/>
        <Routes>
          <Route path="/" element={ <Home /> }/>
          <Route path="/login" element={ <Login /> }/>
          <Route path="/register" element={ <Register /> }/>
          <Route path="/profile" element={ <Profile /> }/>
          <Route path="/profileForm" element={ <ProfileForm /> }/>
          <Route path="/visitorsProfile" element={ <VisitorsProfile /> }/>
          <Route path="/event" element={ <Event /> }/>
          <Route path="/allEvents" element={ <AllEvents /> }/>
          <Route path="/eventForm" element={ <EventForm /> }/>
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;

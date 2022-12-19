import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css';

// import Uploader from './components/Uploader'
import Home from './pages/Home'
import Header from './components/Header'
import Register from './pages/Register'
import Login from './pages/Login'
import Event from './pages/Event'
import Profile from './pages/Profile'
import EventForm from './pages/EventForm';
import Test from './pages/Test'
import AllEvents from './pages/AllEvents';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <>
      <Router>
        <Header/>
        <Routes>
          <Route path='/' element={ <Home /> }/>
          <Route path='/login' element={ <Login /> }/>
          <Route path='/register' element={ <Register /> }/>
          <Route path='/profile' element={ <Profile /> }/>
          <Route path='/event' element={ <Event /> }/>
          <Route path='/allEvents' element={ <AllEvents /> }/>
          <Route path='/eventForm' element={ <EventForm /> }/>
          <Route path='/test' element={ <Test /> }/>
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;

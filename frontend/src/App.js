import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css';

// import Uploader from './components/Uploader'
import Home from './pages/Home'
import Header from './components/Header'
import Register from './pages/Register'
import Login from './pages/Login'
// import Profile from './pages/Profile'

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
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;

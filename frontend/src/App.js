import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css';
// import Uploader from './components/Uploader'
import Login from './pages/Login'
// import Main from './pages/Main'
// import Profile from './pages/Profile'
import Header from './components/Header'
import Register from './pages/Register'

function App() {
  return (
    <>
      <Router>
        <Header/>
        <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;

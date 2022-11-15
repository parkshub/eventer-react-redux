import React from 'react'

import {Link} from 'react-router-dom'

import {FaSignInAlt, FaUserAstronaut} from 'react-icons/fa'

function Header() {
  return (
    <header>
        <div className='logo'>
            <Link to ='/'>Eventer</Link>
        </div>
        <ul>
            <li>
                <Link to='/login'><FaSignInAlt/>Login</Link>
            </li>
            <li>
                <Link to='/register'><FaUserAstronaut/>Register</Link>
            </li>
        </ul>

    </header>
  )
}

export default Header
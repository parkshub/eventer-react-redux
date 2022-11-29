import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'

import { logout } from '../features/auth/authSlice'

import { FaSignInAlt, FaUserAstronaut, FaSignOutAlt, FaUserAlt } from 'react-icons/fa'

function Header() {

    const { user } = useSelector((state) => state.auth)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onClickProfile = () => {
        navigate('/profile')
    }

    const onClickLogout = () => {
        dispatch(logout())
        navigate('/')
    }

    return (
        <header>
            <div className='logo'>
                <Link to ='/'>Eventer</Link>
            </div>
            {!user ? (
                <ul>
                    <li>
                        <Link to='/login'><FaSignInAlt/>Login</Link>
                    </li>
                    <li>
                        <Link to='/register'><FaUserAstronaut/>Register</Link>
                    </li>
                </ul>
            ) : (
                <ul>
                    <li>
                        <button onClick={onClickProfile}>
                            <FaUserAlt/> Profile
                        </button>
                        {/* <Link to='/profile' >Profile</Link> */}
                    </li>
                    <li>
                        <button onClick={onClickLogout}>
                            <FaSignOutAlt /> Logout
                        </button>
                    </li>
                </ul>
            )}
        </header>
    )
}

export default Header
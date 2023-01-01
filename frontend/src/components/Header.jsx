import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, Link } from "react-router-dom"

import { logout } from "../features/auth/authSlice"

import { getAllEvents } from "../features/events/eventSlice"

import { FaSignInAlt, FaUserAstronaut, FaSignOutAlt, FaUserAlt, FaCashRegister, FaLayerGroup, FaUserCircle } from "react-icons/fa"

import Loading from "../components/Loading"


function Header() {

    const { user, isPending } = useSelector((state) => state.auth)
    

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onClickLogin = () => {
        navigate("/login")
    }

    const onClickRegister = () => {
        navigate("/register")
    }

    const onClickProfile = () => {
        navigate("/profile")
    }

    const onClickLogout = () => {
        dispatch(logout())
        navigate("/")
    }

    const onClickBrowse = async() => {
        // dispatch(getAllEvents())
        navigate("/allEvents")
    }

    return (
        
        <header className="header">
            <div className="logo">
                <Link to ="/">Eventer - USA California</Link>
            </div>
            
            {!user ? (
                <ul>
                    <li>
                        <button className="btn"onClick={ onClickLogin }>
                            <FaUserAlt/> Login
                        </button>
                    </li>
                    
                    <li>
                        <button className="btn" onClick={ onClickRegister }>
                            <FaCashRegister /> Register
                        </button>
                    </li>
                </ul>
            ) : (
                <ul>
                    <li>
                        <button className="btn"onClick={ onClickProfile }>
                            <FaUserCircle/> Profile
                        </button>
                    </li>
                    <li>
                        <button className="btn"onClick={ onClickLogout }>
                            <FaSignOutAlt /> Logout
                        </button>
                    </li>
                    <li>
                        <button className="btn" onClick={onClickBrowse}>
                            <FaLayerGroup /> Browse All
                        </button>
                    </li>
                </ul>
            )}
        </header>
    )
}

export default Header
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, Link } from "react-router-dom"

import { logout } from "../features/auth/authSlice"

import { getAllEvents } from "../features/events/eventSlice"

import { FaSignInAlt, FaUserAstronaut, FaSignOutAlt, FaUserAlt } from "react-icons/fa"

import Loading from "../components/Loading"


function Header() {

    const { user, isPending } = useSelector((state) => state.auth)
    

    const dispatch = useDispatch()
    const navigate = useNavigate()

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
            <h1>CHANGE THE NON-LOGGED-IN LINKS TO BUTTONS AND MAKE A NEW ONCLICK FUNCTION FOR THEM RATHER THAN HAVING A LINK TAG</h1>
            <div className="logo">
                <Link to ="/">Eventer - USA California</Link>
            </div>
            {user && <div>welcome user: {user.id + ": " + user.firstName + " " + user.lastName} </div>}
            {!user ? (
                <ul>
                    <li>
                        <Link to="/login"><FaSignInAlt/>Login</Link>
                    </li>
                    <li>
                        <Link to="/register"><FaUserAstronaut/>Register</Link>
                    </li>
                </ul>
            ) : (
                <ul>
                    <li>
                        <button className="btn"onClick={onClickProfile}>
                            <FaUserAlt/> Profile
                        </button>
                    </li>
                    <li>
                        <button className="btn"onClick={onClickLogout}>
                            <FaSignOutAlt /> Logout
                        </button>
                    </li>
                    <li>
                        <button className="btn" onClick={onClickBrowse}>
                            <FaSignOutAlt /> Browse All
                        </button>
                    </li>
                </ul>
            )}
        </header>
    )
}

export default Header
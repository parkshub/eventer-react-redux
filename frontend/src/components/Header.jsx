import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { logout } from "../features/auth/authSlice"
import { getAllEvents } from "../features/events/eventSlice"
import { FaSignOutAlt, FaUserAlt, FaCashRegister, FaLayerGroup, FaUserCircle } from "react-icons/fa"

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
        dispatch(getAllEvents())
        navigate("/allEvents")
    }

    return (
        
        <header className="header">
            <div className="logo">
                <Link to ="/">EVENTER - USA California</Link>
            </div>
            
            {!user ? (
                <ul>
                    <li>
                        <button className="btn-header" onClick={ onClickLogin }>
                            <FaUserAlt className="fa-icon"/> Login
                        </button>
                    </li>
                    
                    <li>
                        <button className="btn-header" onClick={ onClickRegister }>
                            <FaCashRegister className="fa-icon"/> Register
                        </button>
                    </li>
                </ul>
            ) : (
                <ul>
                    <li>
                        <button className="btn-header" onClick={ onClickProfile }>
                            <FaUserCircle className="fa-icon"/> Profile
                        </button>
                    </li>
                    <li>
                        <button className="btn-header"onClick={ onClickLogout }>
                            <FaSignOutAlt className="fa-icon"/> Logout
                        </button>
                    </li>
                    <li>
                        <button className="btn-header" onClick={onClickBrowse}>
                            <FaLayerGroup className="fa-icon"/> Browse
                        </button>
                    </li>
                </ul>
            )}
        </header>
    )
}

export default Header
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../App';
import logo from '../../images/logo.png'
import './Header.css';


const Header=()=>{
    const [loggedInUser,setLoggedInUser]=useContext(UserContext);
    const btnStyle={
        padding:'7px',
        border:'none',
        outline:'none',
        backgroundColor:'tomato',
        color:"white"
    }
    return(
        <div className='header'>
            <img src={logo} alt=""/> 
            <nav>
                <Link to="/shop">Shop</Link>
                <Link to="/review">Order Review</Link>
                <Link to="/inventory">Manage Inventory here</Link>
                <button onClick={()=>setLoggedInUser({})} 
                style={btnStyle}>Sign out</button>
            </nav>
        </div>
    )
}

export default Header;
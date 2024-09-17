import React from 'react'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser,faMapPin,faStore } from '@fortawesome/free-solid-svg-icons';

const SideBarA = () => {
  return (
    <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0  position-relative" style={{ backgroundColor: '#cedff53d' }}>
    <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
      <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-decoration-none">
        <span className="fs-5 d-none d-sm-inline" style={{color:'black'}}>Dashboard Admin</span>
      </a>
      <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu" role="navigation">
   
        <li className="nav-item">
        <FontAwesomeIcon icon={faUser} style={{color:'black'}}/>
          <Link to="/" className="nav-link d-none d-sm-inline px-1" style={{color:'black'}}> Gestion Utilisateur </Link>
 
        </li>
        <li className="nav-item mt-4">
      
        <FontAwesomeIcon icon={faMapPin} style={{color:'black'}}/>
          <Link to="/site" className="nav-link d-none d-sm-inline px-1" style={{color:'black'}}> Gestion Sites </Link>
 
        </li>
        <li className="nav-item mt-4">
        <FontAwesomeIcon icon={faStore} style={{color:'black'}}/>
          <Link to="/article" className="nav-link d-none d-sm-inline px-1" style={{color:'black'}}> Gestion Articles </Link>
 
        </li>
      </ul>
      <hr />
    </div>
  </div>
  )
}

export default SideBarA

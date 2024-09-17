import React from 'react';
import { Navbar, Nav, NavDropdown, Image } from 'react-bootstrap';
import './NavbarAnimation.css';
import { useNavigate } from 'react-router-dom';

const NavBarD = ({ logout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();  // Call the logout function passed as a prop
    navigate('/login');  // Navigate to the login page
  };

  return (
    <Navbar expand="lg" className='m-2 animated-navbar' style={{ backgroundColor: '#cedff53d' }}>
      <Navbar.Brand>
        <img
          src='logo.png'
          width="100"
          alt="Leoni Logo"
          style={{ marginRight: '10px' }}
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav style={{ marginLeft: 'auto' }}>
          <Nav.Link href="#profile">
            <Image src='download.png' roundedCircle style={{ width: '45px', height: '35px', marginRight: '20px' }} />
            Profil
          </Nav.Link>
          <NavDropdown title="Déconnexion" id="basic-nav-dropdown" style={{ marginRight: '20px', marginTop: '2px' }}>
            <NavDropdown.Item onClick={handleLogout}>Déconnexion</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBarD;

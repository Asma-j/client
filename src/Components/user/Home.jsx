import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import NavBarD from '../../NavBarD';
import '../user/home.css';
import { useNavigate } from 'react-router-dom';

const defaultAvatar = 'leoni.png'; 
const Home = ({ logout }) => {
  const [sites, setSites] = useState([]);
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate('/detail');  
  };
  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/sites');
        console.log('Sites fetched:', response.data);
        setSites(response.data.response || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des sites:', error);
      }
    };

    fetchSites();
  }, []);

  return (<div>
    <NavBarD logout={logout} />
    <div className="container">
      <div className="row" style={{backgroundColor:'#002857'}}>
      
          <div className="col-md-6">
            <img src='/home.png' alt="Leoni" className="img" />
          </div>
          <div className="col-md-6 mt-5">
            <div className='flex'>
              <h1>We are LEONI
              </h1>
              <h3 className='text-white mt-5'>Your Empowering Connection.</h3>
              <p className='text-white mt-3 '> As one of the leading providers of energy and data management solutions in the automotive industry and as a company with a clear vision of a sustainable future, we are actively participating in shaping the future of mobility. 
<br/>
That is why we seek sustained connections – especially with our staff members: with ways to join us that open doors to an international career. With values that we share worldwide. And with a degree of flexibility that makes working in harmony with the situation in your personal life possible.</p>
           <h3 className='text-white mt-3 '>Welcome to LEONI in Tunisia.</h3> </div>
          </div></div>
   
    </div>
    <div className="container mt-2">
      <Row>
        {Array.isArray(sites) && sites.length > 0 ? (
          sites.map((site) => (
            <Col md={4} key={site._id}>
              <Card className="mb-4" style={{ width: '300px' }}>
                <Card.Img
                  variant="top"
                  src={site.image ? `http://localhost:5000/${site.image}` : defaultAvatar}
                  alt={site.nom}
                  style={{ height: '180px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{site.nom}</Card.Title>
                  <Card.Text>
                    <strong>Stock:</strong> {site.stock}<br />
                    <strong>Adresse:</strong> {site.adresse}
                  </Card.Text>
                  <Button variant="primary" onClick={handleViewDetails}>
      View Details
    </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No sites available</p>
        )}
      </Row>
    </div>
  </div>
  );
};

export default Home;

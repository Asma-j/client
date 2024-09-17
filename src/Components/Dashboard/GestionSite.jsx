import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import { PlusCircle } from 'react-bootstrap-icons';
import NavbarD from '../../NavBarD';
import SideBarA from './SideBarA';

const GestionSite = ({logout}) => {
  const [sites, setSites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newSite, setNewSite] = useState({
    nom: '',
    adresse: '',
    image: null
  });
  const [currentSite, setCurrentSite] = useState(null);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/sites');
      const siteArray = response.data.response || [];
      setSites(siteArray);
    } catch (error) {
      console.error('Error fetching sites:', error);
      setSites([]);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/sites/delete/${id}`);
      setSites(sites.filter(site => site._id !== id));
    } catch (error) {
      console.error('Error deleting site:', error);
    }
  };

  const handleEdit = (site) => {
    setCurrentSite(site);
    setShowEditModal(true);
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleCloseEditModal = () => setShowEditModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (currentSite) {
      setCurrentSite({
        ...currentSite,
        [name]: value
      });
    } else {
      setNewSite({
        ...newSite,
        [name]: value
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (currentSite) {
      setCurrentSite({
        ...currentSite,
        image: file
      });
    } else {
      setNewSite({
        ...newSite,
        image: file
      });
    }
  };

  const handleAddSite = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nom', newSite.nom);
    formData.append('adresse', newSite.adresse);
    if (newSite.image) {
      formData.append('image', newSite.image);
    }
    try {
      const response = await axios.post('http://localhost:5000/api/sites/store', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSites([...sites, response.data.Site]); 
      handleCloseModal();
    } catch (error) {
      console.error('Error adding site:', error);
    }
  };

  const handleUpdateSite = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nom', currentSite.nom);
    formData.append('adresse', currentSite.adresse);
    if (currentSite.image) {
      formData.append('image', currentSite.image);
    }
    try {
      const response = await axios.put(`http://localhost:5000/api/sites/update/${currentSite._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSites(sites.map(site => (site._id === currentSite._id ? response.data.Site : site)));
      handleCloseEditModal();
    } catch (error) {
      console.error('Error updating site:', error);
    }
  };

  return (
    <div>
      <NavbarD logout={logout}/>
      <div className="d-flex">
        <SideBarA />
        <div className="container mt-5 flex-grow-1">
          <h3>Gestion des Sites</h3>

          <div style={{ textAlign: 'right' }}>
            <PlusCircle
              onClick={handleShowModal}
              size={40}
              style={{ cursor: 'pointer', color: 'blue' }}
            />
          </div>

          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Adresse</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sites.map(site => (
                <tr key={site._id}>
                  <td>{site.nom}</td>
                  <td>{site.adresse}</td>
                  <td>
                    <Button variant="warning" onClick={() => handleEdit(site)}>Edit</Button>{' '}
                    <Button variant="danger" onClick={() => handleDelete(site._id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Modal for Adding Site */}
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Add New Site</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleAddSite}>
                <Form.Group controlId="formNom">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control
                    type="text"
                    name="nom"
                    value={newSite.nom}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formAdresse" className="mt-3">
                  <Form.Label>Adresse</Form.Label>
                  <Form.Control
                    type="text"
                    name="adresse"
                    value={newSite.adresse}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formImage" className="mt-3">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                  Add Site
                </Button>
              </Form>
            </Modal.Body>
          </Modal>

          {/* Modal for Editing Site */}
          {currentSite && (
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Site</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleUpdateSite}>
                  <Form.Group controlId="formNom">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                      type="text"
                      name="nom"
                      value={currentSite.nom}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
        
           
                  <Form.Group controlId="formAdresse" className="mt-3">
                    <Form.Label>Adresse</Form.Label>
                    <Form.Control
                      type="text"
                      name="adresse"
                      value={currentSite.adresse}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formImage" className="mt-3">
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                      type="file"
                      name="image"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="mt-3">
                    Update Site
                  </Button>
                </Form>
              </Modal.Body>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionSite;

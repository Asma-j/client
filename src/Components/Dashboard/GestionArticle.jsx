import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import { PlusCircle } from 'react-bootstrap-icons';
import NavbarD from '../../NavBarD';
import SideBarA from './SideBarA';

const GestionArticle = ({ logout }) => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newArticle, setNewArticle] = useState({
    name_article: '',
    stock: '',
    marque: '',
    catégorie: ''
  });
  const [currentArticle, setCurrentArticle] = useState(null);

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/articles');
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/articles/${id}`);
      setArticles(articles.filter(article => article._id !== id));
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const handleEdit = (article) => {
    setCurrentArticle({
      ...article,
      catégorie: article.catégorie.name
    });
    setShowEditModal(true);
  };
  

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleCloseEditModal = () => setShowEditModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (currentArticle) {
      setCurrentArticle({
        ...currentArticle,
        [name]: value
      });
    } else {
      setNewArticle({
        ...newArticle,
        [name]: value
      });
    }
  };
  
  

  const handleAddArticle = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name_article', newArticle.name_article);
      formData.append('stock', newArticle.stock);
      formData.append('marque', newArticle.marque);
      formData.append('catégorie', newArticle.catégorie);
      formData.append('image', newArticle.image);

      const response = await axios.post('http://localhost:5000/api/articles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setArticles([...articles, response.data]);
      handleCloseModal();
    } catch (error) {
      console.error('Error adding article:', error);
    }
  };

  const handleUpdateArticle = async (e) => {
    e.preventDefault();
    try {
      const updatedArticle = {
        ...currentArticle,
        catégorie: currentArticle.catégorie // Ensure this is correctly formatted
      };
      const response = await axios.put(`http://localhost:5000/api/articles/${currentArticle._id}`, updatedArticle);
      setArticles(articles.map(article => (article._id === currentArticle._id ? response.data : article)));
      handleCloseEditModal();
    } catch (error) {
      console.error('Error updating article:', error);
    }
  };
  
  
  return (
    <div>
      <NavbarD logout={logout} />
      <div className="d-flex">
        <SideBarA />
        <div className="container mt-5 flex-grow-1">
          <h3>Gestion des Articles</h3>

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
                <th>Stock</th>
                <th>Marque</th>
                <th>Catégorie</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(article => (
                <tr key={article._id}>
                  <td>{article.name_article}</td>
                  <td>{article.stock}</td>
                  <td>{article.marque}</td>
                  <td>{article.catégorie.name}</td>
                  <td>
                    <Button variant="warning" onClick={() => handleEdit(article)}>Edit</Button>{' '}
                    <Button variant="danger" onClick={() => handleDelete(article._id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Modal for Adding Article */}
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Add New Article</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleAddArticle}>
                <Form.Group controlId="formNameArticle">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control
                    type="text"
                    name="name_article"
                    value={newArticle.name_article}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formStock" className="mt-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={newArticle.stock}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formMarque" className="mt-3">
                  <Form.Label>Marque</Form.Label>
                  <Form.Control
                    type="text"
                    name="marque"
                    value={newArticle.marque}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formCatégorie" className="mt-3">
                  <Form.Label>Catégorie</Form.Label>
                  <Form.Control
                    type="text"
                    name="catégorie"
                    value={newArticle.catégorie}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formImage" className="mt-3">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3">
                  Add Article
                </Button>
              </Form>
            </Modal.Body>
          </Modal>

          {/* Modal for Editing Article */}
          {currentArticle && (
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Article</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleUpdateArticle}>
                  <Form.Group controlId="formNameArticle">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                      type="text"
                      name="name_article"
                      value={currentArticle.name_article}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formStock" className="mt-3">
                    <Form.Label>Stock</Form.Label>
                    <Form.Control
                      type="number"
                      name="stock"
                      value={currentArticle.stock}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formMarque" className="mt-3">
                    <Form.Label>Marque</Form.Label>
                    <Form.Control
                      type="text"
                      name="marque"
                      value={currentArticle.marque}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formCatégorie" className="mt-3">
  <Form.Label>Catégorie</Form.Label>
  <Form.Control
    type="text"
    name="catégorie"
    value={currentArticle.catégorie}
    onChange={handleInputChange}
    required
  />
</Form.Group>




                  <Button variant="primary" type="submit" className="mt-3">
                    Update Article
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

export default GestionArticle;

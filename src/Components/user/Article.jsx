import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { Modal, Button, Form } from 'react-bootstrap';
import NavBarD from '../../NavBarD';

function Article({ logout }) {
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [transferQuantity, setTransferQuantity] = useState(1);

  useEffect(() => {
    axios.get('http://localhost:5000/api/articles/categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        setError('Failed to fetch categories.');
      });
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const endpoint = selectedCategory ? 
          `http://localhost:5000/api/articles?category=${selectedCategory}` : 
          'http://localhost:5000/api/articles';
        const response = await axios.get(endpoint);
        setArticles(response.data);
        setError(null); 
      } catch (error) {
        console.error('Error fetching articles:', error);
        setError('Failed to fetch articles.');
      }
    };

    fetchArticles();
  }, [selectedCategory]);


  const handleShowModal = (article) => {
    setSelectedArticle(article);
    setShowModal(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedArticle(null);
    setTransferQuantity(1); // Reset quantity
  };

  const handleTransferSubmit = async () => {
    try {

      await axios.post('http://localhost:5000/api/articles/transfer', {
        articleId: selectedArticle._id,
        quantity: transferQuantity
      });


      setArticles(articles.map(article => {
        if (article._id === selectedArticle._id) {
          return {
            ...article,
            stock: article.stock - transferQuantity,
            transfers: [...article.transfers, {
              quantity: transferQuantity,
              date: new Date(),
     
            }]
          };
        }
        return article;
      }));

      handleCloseModal();
    } catch (error) {
      console.error('Error submitting transfer request:', error);

    }
  };

  return (
    <div>
      <NavBarD logout={logout} />
      <div className="container-fluid">
        <div className="row">
          {/* Categories on the right */}
          <div className="col-md-3 border-end p-4 bg-light">
            <h4>Filtres</h4>
            {error ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
              <ul className="list-group">
                <li 
                  className="list-group-item list-group-item-action"
                  onClick={() => setSelectedCategory(null)}
                  style={{ cursor: 'pointer' }}
                >
                  Tous les articles
                </li>
                {categories.map(category => (
                  <li 
                    key={category._id} 
                    className="list-group-item list-group-item-action" 
                    onClick={() => setSelectedCategory(category._id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Articles on the left */}
          <div className="col-md-9 p-4">
            <h3>Articles</h3>
            {articles.length === 0 && !error ? (
              <div className="alert alert-info">
                Aucun article trouvé pour cette catégorie.
              </div>
            ) : (
              <div className="row">
                {articles.map(article => (
                  <div key={article._id} className="col-md-3 mb-4">
                    <div className="card">
                      <img 
                        src={`http://localhost:5000/${article.image}`}
                        style={{ height: "200px" }} 
                        className="card-img-top" 
                        alt={article.name_article} 
                      />
                      <div className="card-body">
                        <h5 className="card-title">{article.name_article}</h5>
                        <p className="card-text">Marque: {article.marque}</p>
                        <p className="card-text">Stock: {article.stock}</p>
                        <button 
                          className="btn btn-primary"
                          onClick={() => handleShowModal(article)}
                        >
                          Demande de transfert
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Demande de transfert</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formQuantity">
              <Form.Label>Nombre d'articles à transférer</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={transferQuantity}
                onChange={(e) => setTransferQuantity(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleTransferSubmit}>
            Soumettre
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Article;

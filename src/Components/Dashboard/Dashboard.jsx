import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import { PlusCircle } from 'react-bootstrap-icons';
import NavbarD from '../../NavBarD';
import SideBarA from './SideBarA';

const Dashboard = ({ logout }) => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    role: ''
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [isPasswordEnabled, setIsPasswordEnabled] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      const filteredUsers = response.data.response.filter(user => user.role && user.role.name !== 'admin');
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setUsers(users.filter(user => user._id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEdit = (user) => {
    setCurrentUser({
      ...user,
      roleName: user.role.name // Set the role name here for the form
    });
    setShowEditModal(true);
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setIsPasswordEnabled(false); // Reset password field state
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        [name]: value
      });
    } else {
      setNewUser({
        ...newUser,
        [name]: value
      });
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/store', {
        email: newUser.email,
        password: newUser.password,
        roleName: newUser.role
      });
      setUsers([...users, response.data.data]);
      handleCloseModal();
    } catch (error) {
      console.error('Error adding user:', error.response ? error.response.data : error.message);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const updatedUser = { ...currentUser };
    if (!isPasswordEnabled) {
      delete updatedUser.password; 
    }
    try {
      const response = await axios.put('http://localhost:5000/api/users/update', updatedUser);
      setUsers(users.map(user => (user._id === currentUser._id ? response.data.response : user)));
      handleCloseEditModal();
    } catch (error) {
      console.error('Error updating user:', error.response ? error.response.data : error.message);
    }
  };

  const togglePasswordField = () => {
    setIsPasswordEnabled(!isPasswordEnabled);
  };

  return (
    <div>
      <NavbarD logout={logout} />
      <div className="d-flex">
        <SideBarA />
        <div className="container mt-5 flex-grow-1">
          <h3>Gestion des Utilisateurs</h3>

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
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.email}</td>
                  <td>{user.role.name}</td>
                  <td>{new Date(user.createdAt).toLocaleString()}</td>
                  <td>
                    <Button variant="warning" onClick={() => handleEdit(user)}>Edit</Button>{' '}
                    <Button variant="danger" onClick={() => handleDelete(user._id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Modal for Adding User */}
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Add New User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleAddUser}>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formPassword" className="mt-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formRole" className="mt-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    type="text"
                    name="role"
                    value={newUser.role}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                  Add User
                </Button>
              </Form>
            </Modal.Body>
          </Modal>

          {/* Modal for Editing User */}
          {currentUser && (
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
              <Modal.Header closeButton>
                <Modal.Title>Edit User</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleUpdateUser}>
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={currentUser.email}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formPassword" className="mt-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Check
                      type="checkbox"
                      label="Change Password"
                      onChange={togglePasswordField}
                      className="mb-2"
                    />
                    <Form.Control
                      type="password"
                      name="password"
                      value={currentUser.password}
                      onChange={handleInputChange}
                      disabled={!isPasswordEnabled}
                      placeholder="Enter new password"
                    />
                  </Form.Group>
                  <Form.Group controlId="formRole" className="mt-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Control
                      type="text"
                      name="roleName"
                      value={currentUser.roleName}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="mt-3">
                    Update User
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

export default Dashboard;

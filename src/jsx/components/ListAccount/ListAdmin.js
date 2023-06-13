import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal } from "react-bootstrap";

const ListAdmin = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const tokenDetailsString = localStorage.getItem("users");
  const tokenDetails = JSON.parse(tokenDetailsString);
  const token = tokenDetails.token;

  // Fetch All data knowledge

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setData(response.data.data))
      .catch((error) => console.error(error));
  }, [token]);

  const handleClose = () => setShowModal(false);
  const handleShow = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>IDUser</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data
            .filter((user) => user.Roles[0].rolename === "Admin")
            .map((user) => (
              <tr key={user.IDUser}>
                <td>{user.IDUser}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.Roles[0].rolename}</td>
                <td>
                  <Button variant="warning" onClick={() => handleShow(user)}>
                    Update
                  </Button>{" "}
                  <Button variant="danger">Delete</Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>IDUser: {selectedUser.IDUser}</p>
          <p>Username: {selectedUser.username}</p>
          <p>Email: {selectedUser.email}</p>
          <p>
            Role:{" "}
            {selectedUser.Roles &&
              selectedUser.Roles[0] &&
              selectedUser.Roles[0].rolename}
          </p>

          <form>
            <div className="form-group">
              <label htmlFor="username">New Username:</label>
              <input type="text" className="form-control" id="username" />
            </div>
            <div className="form-group">
              <label htmlFor="email">New Email:</label>
              <input type="email" className="form-control" id="email" />
            </div>
            <div className="form-group">
              <label htmlFor="role">New Role:</label>
              <select className="form-control" id="role">
                <option>User</option>
                <option>Admin</option>
              </select>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary">Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListAdmin;

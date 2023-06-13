//Import Library/Package
import { useState, useEffect } from "react";
import swal from "sweetalert";
import axios from "axios";
import { Modal, Form, Button } from "react-bootstrap";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { BsThreeDots } from "react-icons/bs";

//Function Component
const ListAccount = () => {
  //State and Hooks
  const tokenDetailsString = localStorage.getItem("users");
  const tokenDetails = JSON.parse(tokenDetailsString);
  const token = tokenDetails.token;
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateUser, setUpdateUser] = useState({});
  const [formData, setFormData] = useState({
    id_role: "",
    username: "",
    password: "",
    email: "",
    profile_picture: null,
  });
  const [roles, setRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  //Effect Hook
  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setData(response.data.data))
      .catch((error) => console.error(error));

    // Mengambil data roles dari API
    axios
      .get("http://localhost:3000/auth/role", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setRoles(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token]);

  useEffect(() => {
    setFilteredData(
      selectedRole ? data.filter((user) => user.id_role === selectedRole) : data
    );
  }, [selectedRole, data]);

  //Modal Function
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const handleShowUpdateModal = (IDUser) => {
    // Ubah IDUser menjadi id_user
    const updateUser = filteredData.find((user) => user.IDUser === IDUser);
    setUpdateUser({ ...updateUser, id_user: IDUser });
    setShowUpdateModal(true);
  };

  const handleUpdateCloseModal = () => setShowUpdateModal(false);
  const handleUpdate = (e, id_user) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("IDRole", parseInt(updateUser.id_role));
    formData.append("Username", updateUser.username);
    formData.append("Email", updateUser.email);
    if (updateUser.profile_picture) {
      formData.append("profile_picture", updateUser.profile_picture);
    }

    axios
      .put(`http://localhost:3000/auth/users/${id_user}`, formData, {
        headers: {
          Authorization: `Bearer ${[token]}`,
          "Content-Type": "multipart/form-data", // tambahkan header ini
        },
      })
      .then((response) => {
        console.log(response.data);
        handleUpdateCloseModal();
        window.location.reload();
      })
      .catch((error) => console.log(error));
  };

  //Input Handling Functions
  const handleSelectRole = (e) => {
    setSelectedRole(parseInt(e.target.value));
  };
  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setFormData({
        ...formData,
        profile_picture: file,
      });
    } else {
      setFormData({
        ...formData,
        profile_picture: null,
      });
    }
  };

  const handleSelect = (eventKey) => {
    console.log(`Selected action: ${eventKey}`);
    // Perform action based on selected value
  };

  //Submit Function
  const handleSubmit = (event) => {
    event.preventDefault();

    if (formData.id_role !== "") {
      const data = new FormData();
      data.append("IDRole", parseInt(formData.id_role));
      data.append("Username", formData.username);
      data.append("Password", formData.password);
      data.append("Email", formData.email);
      if (formData.profile_picture === null) {
        data.append("profile_picture", null);
      } else {
        data.append("profile_picture", formData.profile_picture);
      }

      axios
        .post("http://localhost:3000/users", data)
        .then((response) => {
          console.log(response);
          setFormData({
            id_role: "",
            username: "",
            password: "",
            email: "",
            profile_picture: null,
          });
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  function deleteUser(id_user) {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this user!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        fetch(`http://localhost:3000/auth/users/${id_user}`, {
          headers: {
            Authorization: `Bearer ${[token]}`,
          },
          method: "DELETE",
        })
          .then((response) => {
            if (response.ok) {
              swal("User has been deleted!", {
                icon: "success",
              }).then(() => {
                window.location.reload();
              });
            } else {
              swal("Failed to delete user", {
                icon: "error",
              });
            }
          })
          .catch((error) => {
            swal("Failed to delete user", {
              icon: "error",
            });
          });
      } else {
        swal("User is safe!");
      }
    });
  }
  return (
    <div className="row">
      <div className="col-md-6 col-sm-12">
        <div className="form-group">
          <label htmlFor="role-select">Filter by Role:</label>
          <select
            id="role-select"
            className="form-control"
            onChange={handleSelectRole}
          >
            <option value="">All Role</option>

            {roles.map((role, index) => (
              <option key={`role-${index}`} value={role.id_role}>
                {role.rolename}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="col-md-6 col-sm-12 d-flex align-items-center justify-content-end">
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleShowModal}
        >
          Add User
        </button>
      </div>

      <div className="col-12 mt-4">
        <table className="table display mb-4 dataTablesCard order-table card-table text-black application ">
          <thead>
            <tr>
              <th>Profile</th>

              <th>Role</th>
              <th>Username</th>
              <th>Email</th>
              <th>Last Login</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.slice(startIndex, endIndex).map((user) => (
              <tr key={user.IDUser}>
                <td>
                  <img
                    src={user.profile_picture}
                    className="rounded-circle"
                    width="50"
                    height="50"
                    alt={"Null"}
                  />
                </td>

                <td>{user.Roles[0].rolename}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.last_login}</td>
                <td>
                  <DropdownButton
                    id="dropdown-button"
                    title={<BsThreeDots size={20} />}
                    onSelect={handleSelect}
                    variant="outline" // tambahkan properti variant="outline"
                  >
                    <Dropdown.Item
                      eventKey="update"
                      onClick={() => handleShowUpdateModal(user.IDUser)}
                    >
                      Update
                    </Dropdown.Item>

                    <Dropdown.Item
                      eventKey="delete"
                      onClick={() => deleteUser(user.IDUser)}
                    >
                      Delete
                    </Dropdown.Item>
                  </DropdownButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <nav>
          <ul className="pagination">
            {pageNumbers.map((number) => (
              <li key={number} className="page-item">
                <button
                  onClick={() => handlePageChange(number)}
                  className="page-link"
                >
                  {number}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Modal Add User */}
      <div className="row">
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  as="select"
                  name="id_role"
                  value={formData.id_role}
                  onChange={handleInputChange}
                >
                  <option value="">- Pilih Role -</option>
                  {roles.map((role) => (
                    <option key={role.id_role} value={role.id_role}>
                      {role.rolename}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Upload Foto</Form.Label>
                <Form.Control
                  accept="image/*"
                  type="file"
                  name="profile_picture"
                  onChange={handleFileInputChange}
                />
              </Form.Group>
              <div className="text-end mt-3">
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </div>

      {/* Modal Update User */}
      <div className="row">
        <Modal show={showUpdateModal} onHide={handleUpdateCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Update User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={(e) => handleUpdate(e, updateUser.id_user)}>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  as="select"
                  name="id_role"
                  value={updateUser.id_role}
                  onChange={(e) =>
                    setUpdateUser({ ...updateUser, id_role: e.target.value })
                  }
                >
                  <option value="">- Pilih Role -</option>
                  {roles.map((role) => (
                    <option key={role.id_role} value={role.id_role}>
                      {role.rolename}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={updateUser.username}
                  onChange={(e) =>
                    setUpdateUser({ ...updateUser, username: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={updateUser.email}
                  onChange={(e) =>
                    setUpdateUser({ ...updateUser, email: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Upload Foto</Form.Label>
                <Form.Control
                  accept="image/*"
                  type="file"
                  name="profile_picture"
                  // value={updateUser.profile_picture}
                  onChange={(e) =>
                    setUpdateUser({
                      ...updateUser,
                      profile_picture: e.target.files[0],
                    })
                  }
                />
              </Form.Group>
              <div className="text-end mt-3">
                <Button variant="primary" type="submit">
                  Update
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default ListAccount;

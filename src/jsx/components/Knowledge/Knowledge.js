import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import "swiper/css";
import axios from "axios";
import { Modal, Form, Button } from "react-bootstrap";
const Knowledge = () => {
  //State And Hook
  const [data, setData] = useState([]);
  const tokenDetailsString = localStorage.getItem("users");
  const tokenDetails = JSON.parse(tokenDetailsString);
  const token = tokenDetails.token;

  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateKnowledge, setUpdateKnowledge] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [formData, setFormData] = useState({
    idcategory: "",
    knowledge_name: "",
    description: "",
    status: "",
  });
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
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

  // Fetch All data knowledge

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/knowledge", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setData(response.data.data))
      .catch((error) => console.error(error));

    // Mengambil data category dari API
    axios
      .get("http://localhost:3000/auth/category", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCategories(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token]);

  useEffect(() => {
    setFilteredData(
      selectedCategory
        ? data.filter((knowledge) => knowledge.idcategory === selectedCategory)
        : data
    );
  }, [selectedCategory, data]);

  //Modal Function
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const handleShowUpdateModal = (id_knowledge) => {
    // Ubah IDUser menjadi id_user
    const updateKnowledge = filteredData.find(
      (knowledge) => knowledge.id_knowledge === id_knowledge
    );
    setUpdateKnowledge({ ...updateKnowledge, id_knowledge: id_knowledge });
    setShowUpdateModal(true);
  };

  const handleUpdateCloseModal = () => setShowUpdateModal(false);
  const handleUpdate = (e, id_knowledge) => {
    e.preventDefault(); // Prevent form submission

    const updatedData = {
      id_knowledge: updateKnowledge.id_knowledge,
      idcategory: parseInt(updateKnowledge.idcategory),
      knowledge_name: updateKnowledge.knowledge_name,
      description: updateKnowledge.description,
      status: Number(updateKnowledge.status),
    };

    axios
      .put(
        `http://localhost:3000/auth/knowledge/${id_knowledge}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${[token]}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data.updatedData);
        // Close modal and reload page to show updated data
        handleUpdateCloseModal();
        window.location.reload();
      })
      .catch((error) => console.log(error));
  };

  //Handling Funtion
  const handleSelectCategory = (e) => {
    setSelectedCategory(parseInt(e.target.value));
  };
  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  //Submit Function
  const handleSubmit = (event) => {
    event.preventDefault();
    // Mengirim data user ke API
    if (formData.idcategory !== "") {
      const data = {
        idcategory: parseInt(formData.idcategory), // convert id_role to integer
        knowledge_name: formData.knowledge_name,
        description: formData.description,
        status: parseInt(formData.status),
      };
      axios
        .post("http://localhost:3000/auth/knowledge/", data, {
          headers: {
            Authorization: `Bearer ${[token]}`,
          },
        })
        .then((response) => {
          console.log(response);
          // Mereset form setelah berhasil menambahkan knowledge
          setFormData({
            idcategory: "",
            knowledge_name: "",
            description: "",
            status: "",
          });
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  function deleteKnowledge(id_knowledge) {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this knowledge!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        fetch(`http://localhost:3000/auth/knowledge/${id_knowledge}`, {
          headers: {
            Authorization: `Bearer ${[token]}`,
          },
          method: "DELETE",
        })
          .then((response) => {
            if (response.ok) {
              swal("Knowledge has been deleted!", {
                icon: "success",
              }).then(() => {
                window.location.reload();
              });
            } else {
              swal("Failed to delete knowledge", {
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
        swal("Knowledge is safe!");
      }
    });
  }
  return (
    <>
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <div className="form-group">
            <label htmlFor="category-select">Filter by Category:</label>
            <select
              id="category-select"
              className="form-control"
              onChange={handleSelectCategory}
            >
              <option value="">All Category</option>

              {categories.map((category, index) => (
                <option key={`category-${index}`} value={category.idcategory}>
                  {category.categoryname}
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
            Add Knowledge
          </button>
        </div>

        <div className="row col-12 mt-4">
          {filteredData.slice(startIndex, endIndex).map((knowledge, i) => (
            // {data.map((knowledge, i) => (
            <div className="col-xl-4 col-md-6" key={i}>
              <div className="card all-crs-wid">
                <div className="card-body">
                  <div className="courses-bx">
                    <div className="dlab-info">
                      <div className="dlab-title d-flex justify-content-between">
                        <div>
                          {/* <h4>
                            <Link to={`./knowledge/${knowledge.id_knowledge}`}>
                              {knowledge.knowledge_name}
                            </Link>
                          </h4> */}
                          <h4>
                            <Link to={`/knowledge/${knowledge.id_knowledge}`}>
                              {knowledge.knowledge_name}
                            </Link>
                          </h4>
                          <p className="m-0">
                            {knowledge.description.length > 100
                              ? knowledge.description.slice(0, 100) + "..."
                              : knowledge.description}
                          </p>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between content align-items-center">
                        <span>
                          <svg
                            className="me-2"
                            width="24"
                            height="25"
                            viewBox="0 0 24 25"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M21.2 18.6C20.5 18.5 19.8 18.4 19 18.4C16.5 18.4 14.1 19.1 12 20.5C9.90004 19.2 7.50005 18.4 5.00005 18.4C4.30005 18.4 3.50005 18.5 2.80005 18.6C2.30005 18.7 1.90005 19.2 2.00005 19.8C2.10005 20.4 2.60005 20.7 3.20005 20.6C3.80005 20.5 4.40005 20.4 5.00005 20.4C7.30005 20.4 9.50004 21.1 11.4 22.5C11.7 22.8 12.2 22.8 12.6 22.5C15 20.8 18 20.1 20.8 20.6C21.3 20.7 21.9 20.3 22 19.8C22.1 19.2 21.7 18.7 21.2 18.6ZM21.2 2.59999C20.5 2.49999 19.8 2.39999 19 2.39999C16.5 2.39999 14.1 3.09999 12 4.49999C9.90004 3.09999 7.50005 2.39999 5.00005 2.39999C4.30005 2.39999 3.50005 2.49999 2.80005 2.59999C2.40005 2.59999 2.00005 3.09999 2.00005 3.49999V15.5C2.00005 16.1 2.40005 16.5 3.00005 16.5C3.10005 16.5 3.10005 16.5 3.20005 16.5C3.80005 16.4 4.40005 16.3 5.00005 16.3C7.30005 16.3 9.50004 17 11.4 18.4C11.7 18.7 12.2 18.7 12.6 18.4C15 16.7 18 16 20.8 16.5C21.3 16.6 21.9 16.2 22 15.7C22 15.6 22 15.6 22 15.5V3.49999C22 3.09999 21.6 2.59999 21.2 2.59999Z"
                              fill="#c7c7c7"
                            />
                          </svg>
                          {knowledge.status === 1 ? "Private" : "Public"}
                        </span>
                        <div className="d-flex justify-content-between">
                          <button
                            type="button"
                            className="btn btn-danger btn-sm mr-2"
                            onClick={() =>
                              deleteKnowledge(knowledge.id_knowledge)
                            }
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm mx-2"
                            onClick={() =>
                              handleShowUpdateModal(knowledge.id_knowledge)
                            }
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
              <Modal.Title>Add Knowledge</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    as="select"
                    name="idcategory"
                    value={formData.idcategory}
                    onChange={handleInputChange}
                  >
                    <option value="">- Pilih Category -</option>
                    {categories.map((category) => (
                      <option
                        key={category.idcategory}
                        value={category.idcategory}
                      >
                        {category.categoryname}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Knowledge Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="knowledge_name"
                    value={formData.knowledge_name}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    maxLength={300}
                  />
                  <Form.Text className="text-muted">
                    {formData.description.length}/300 characters
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Visibility</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleSelectChange}
                  >
                    <option value={1}>Private</option>
                    <option value={2}>Public</option>
                  </Form.Select>
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
              <Modal.Title>Update Knowledge</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form
                onSubmit={(e) => handleUpdate(e, updateKnowledge.id_knowledge)}
              >
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    as="select"
                    name="idcategory"
                    value={updateKnowledge.idcategory}
                    onChange={(e) =>
                      setUpdateKnowledge({
                        ...updateKnowledge,
                        idcategory: e.target.value,
                      })
                    }
                  >
                    <option value="">- Pilih Category -</option>
                    {categories.map((category) => (
                      <option
                        key={category.idcategory}
                        value={category.idcategory}
                      >
                        {category.categoryname}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Knowledge Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="knowledge_name"
                    value={updateKnowledge.knowledge_name}
                    onChange={(e) =>
                      setUpdateKnowledge({
                        ...updateKnowledge,
                        knowledge_name: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={updateKnowledge.description}
                    onChange={(e) =>
                      setUpdateKnowledge({
                        ...updateKnowledge,
                        description: e.target.value,
                      })
                    }
                    maxLength={300}
                  />
                  <Form.Text className="text-muted">
                    {formData.description.length}/300 characters
                  </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Visibility</Form.Label>
                  <Form.Select
                    name="status"
                    value={updateKnowledge.status}
                    onChange={(e) =>
                      setUpdateKnowledge({
                        ...updateKnowledge,
                        status: parseInt(e.target.value),
                      })
                    }
                  >
                    <option value={1}>Private</option>
                    <option value={2}>Public</option>
                  </Form.Select>
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
    </>
  );
};
export default Knowledge;

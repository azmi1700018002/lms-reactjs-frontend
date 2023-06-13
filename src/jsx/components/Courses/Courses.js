import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import "swiper/css";
import axios from "axios";
import { Modal, Form, Button } from "react-bootstrap";

const Courses = () => {
  //State And Hook
  const [data, setData] = useState([]);
  const tokenDetailsString = localStorage.getItem("users");
  const tokenDetails = JSON.parse(tokenDetailsString);
  const token = tokenDetails.token;

  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateCourses, setUpdateCourses] = useState({});
  const [selectedKnowledge, setSelectedKnowledge] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [formData, setFormData] = useState({
    id_user: "",
    id_knowledge: "",
    course_name: "",
    course_desc: "",
  });
  const [knowledges, setKnowledge] = useState([]);
  const [users, setUsers] = useState([]);
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

  // Fetch All data courses

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/course", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setData(response.data.data))
      .catch((error) => console.error(error));

    // Mengambil data knowledge dari API
    axios
      .get("http://localhost:3000/auth/knowledge", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setKnowledge(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });

    // Mengambil data users dari API
    axios
      .get("http://localhost:3000/auth/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUsers(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token]);

  useEffect(() => {
    setFilteredData(
      selectedKnowledge
        ? data.filter((courses) => courses.id_knowledge === selectedKnowledge)
        : data
    );
  }, [selectedKnowledge, data]);

  //Modal Function
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const handleShowUpdateModal = (id_course) => {
    // Ubah IDUser menjadi id_user
    const updateCourses = filteredData.find(
      (courses) => courses.id_course === id_course
    );
    setUpdateCourses({ ...updateCourses, id_course: id_course });
    setShowUpdateModal(true);
  };

  const handleUpdateCloseModal = () => setShowUpdateModal(false);
  const handleUpdate = (e, id_course) => {
    e.preventDefault(); // Prevent form submission

    const updatedData = {
      id_course: updateCourses.id_course,
      id_user: updateCourses.IDUser, // Menambahkan pengisian nilai id_user ke dalam objek updatedData
      id_knowledge: parseInt(updateCourses.id_knowledge),
      course_name: updateCourses.course_name,
      course_desc: updateCourses.course_desc,
    };

    axios
      .put(`http://localhost:3000/auth/course/${id_course}`, updatedData, {
        headers: {
          Authorization: `Bearer ${[token]}`,
        },
      })
      .then((response) => {
        console.log(response.data.updatedData);
        // Close modal and reload page to show updated data
        handleUpdateCloseModal();
        window.location.reload();
      })
      .catch((error) => console.log(error));
  };

  //Handling Funtion
  const handleSelectKnowledge = (e) => {
    setSelectedKnowledge(parseInt(e.target.value));
  };
  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  //Submit Function
  const handleSubmit = (event) => {
    event.preventDefault();
    // Mengirim data user ke API
    if (formData.id_user !== "") {
      const data = {
        IDUser: formData.id_user,
        id_knowledge: parseInt(formData.id_knowledge),
        course_name: formData.course_name,
        course_desc: formData.course_desc,
      };

      axios
        .post("http://localhost:3000/auth/course/", data, {
          headers: {
            Authorization: `Bearer ${[token]}`,
          },
        })
        .then((response) => {
          console.log(response);
          // Mereset form setelah berhasil menambahkan knowledge
          setFormData({
            id_user: "",
            id_knowledge: "",
            course_name: "",
            course_desc: "",
          });
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  function deleteCourse(id_course) {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this course!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        fetch(`http://localhost:3000/auth/course/${id_course}`, {
          headers: {
            Authorization: `Bearer ${[token]}`,
          },
          method: "DELETE",
        })
          .then((response) => {
            if (response.ok) {
              swal("Course has been deleted!", {
                icon: "success",
              }).then(() => {
                window.location.reload();
              });
            } else {
              swal("Failed to delete course", {
                icon: "error",
              });
            }
          })
          .catch((error) => {
            swal("Failed to delete course", {
              icon: "error",
            });
          });
      } else {
        swal("Course is safe!");
      }
    });
  }
  return (
    <>
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <select
            id="category-select"
            className="form-control"
            onChange={handleSelectKnowledge}
            defaultValue=""
          >
            <option value=""> All Knowledge</option>

            {knowledges.map((knowledge, index) => (
              <option key={`knowledge-${index}`} value={knowledge.id_knowledge}>
                {knowledge.knowledge_name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6 col-sm-12 d-flex align-items-center justify-content-end">
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleShowModal}
          >
            Add Course
          </button>
        </div>

        <div className="row col-12 mt-4">
          {filteredData.slice(startIndex, endIndex).map((courses, i) => (
            // {data.map((knowledge, i) => (
            <div className="col-xl-4 col-md-6" key={i}>
              <div className="card all-crs-wid">
                <div className="card-body">
                  <div className="courses-bx">
                    <div className="dlab-info">
                      <div className="dlab-title d-flex justify-content-between">
                        <div>
                          <h4>
                            {/* <Link to={"./course-details-2"}>
                              {courses.course_name}
                            </Link> */}
                            <Link to={`./courses/${courses.id_course}`}>
                              {courses.course_name}
                            </Link>
                          </h4>
                          <p className="m-0">
                            {courses.course_desc.length > 100
                              ? courses.course_desc.slice(0, 100) + "..."
                              : courses.course_desc}
                          </p>
                        </div>
                      </div>

                      <div className="d-flex justify-content-end">
                        <div className="ml-auto">
                          <button
                            type="button"
                            className="btn btn-link p-0"
                            onClick={() =>
                              handleShowUpdateModal(courses.id_course)
                            }
                          >
                            <i className="bi bi-pencil text-orange"></i>
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            className="btn btn-link p-0 mx-2"
                            onClick={() => deleteCourse(courses.id_course)}
                          >
                            <i className="bi bi-trash"></i>
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
              <Modal.Title>Add Course</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>User</Form.Label>
                  <Form.Control
                    as="select"
                    name="id_user"
                    value={formData.id_user}
                    onChange={handleInputChange}
                  >
                    <option value="">- Pilih User -</option>
                    {users.map((user) => (
                      <option key={user.IDUser} value={user.IDUser}>
                        {user.username}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Knowledge</Form.Label>
                  <Form.Control
                    as="select"
                    name="id_knowledge"
                    value={formData.id_knowledge}
                    onChange={handleInputChange}
                  >
                    <option value="">- Pilih Knowledge -</option>
                    {knowledges.map((knowledge) => (
                      <option
                        key={knowledge.id_knowledge}
                        value={knowledge.id_knowledge}
                      >
                        {knowledge.knowledge_name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Course Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="course_name"
                    value={formData.course_name}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="course_desc"
                    value={formData.course_desc}
                    onChange={handleInputChange}
                    maxLength={300}
                  />
                  <Form.Text className="text-muted">
                    {formData.course_desc.length}/300 characters
                  </Form.Text>
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
              <Modal.Title>Update Course</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={(e) => handleUpdate(e, updateCourses.id_course)}>
                <Form.Group className="mb-3">
                  <Form.Label>User</Form.Label>
                  <Form.Control
                    as="select"
                    name="IDUser"
                    value={updateCourses.IDUser}
                    onChange={(e) =>
                      setUpdateCourses({
                        ...updateCourses,
                        IDUser: e.target.value,
                      })
                    }
                  >
                    <option value="">- Pilih User -</option>
                    {users.map((user) => (
                      <option key={user.IDUser} value={user.IDUser}>
                        {user.username}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                {/* <div>Nilai IDUser: {updateCourses.IDUser}</div> */}
                <Form.Group className="mb-3">
                  <Form.Label>Knowledge</Form.Label>
                  <Form.Control
                    as="select"
                    name="id_knowledge"
                    value={updateCourses.id_knowledge}
                    onChange={(e) =>
                      setUpdateCourses({
                        ...updateCourses,
                        id_knowledge: e.target.value,
                      })
                    }
                  >
                    <option value="">- Pilih Knowledge -</option>
                    {knowledges.map((knowledge) => (
                      <option
                        key={knowledge.id_knowledge}
                        value={knowledge.id_knowledge}
                      >
                        {knowledge.knowledge_name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Course Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="course_name"
                    value={updateCourses.course_name}
                    onChange={(e) =>
                      setUpdateCourses({
                        ...updateCourses,
                        course_name: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="course_desc"
                    value={updateCourses.course_desc}
                    onChange={(e) =>
                      setUpdateCourses({
                        ...updateCourses,
                        course_desc: e.target.value,
                      })
                    }
                    maxLength={300}
                  />
                  <Form.Text className="text-muted">
                    {formData.course_desc.length}/300 characters
                  </Form.Text>
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

export default Courses;

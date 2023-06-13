import "swiper/css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import { Modal, Form, Button } from "react-bootstrap";
const Quiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [users, setUsers] = useState([]);
  const tokenDetailsString = localStorage.getItem("users");
  const tokenDetails = JSON.parse(tokenDetailsString);
  const token = tokenDetails.token;

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id_user: "",
    quiz_name: "",
    quiz_desc: "",
    quiz_type: "",
  });
  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/quiz", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setQuizzes(response.data.data))
      .catch((error) => console.error(error));

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

  //Modal Function
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  //Handling Funtion
  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  //Submit Function
  const handleSubmit = (event) => {
    event.preventDefault();
    // Mengirim data user ke API
    if (formData.id_quiz !== "") {
      const data = {
        IDUser: formData.id_user,
        quiz_name: formData.quiz_name,
        quiz_desc: formData.quiz_desc,
        quiz_type: formData.quiz_type,
      };

      axios
        .post("http://localhost:3000/auth/quiz/", data, {
          headers: {
            Authorization: `Bearer ${[token]}`,
          },
        })
        .then((response) => {
          console.log(response);
          // Mereset form setelah berhasil menambahkan knowledge
          setFormData({
            id_user: "",
            quiz_name: "",
            quiz_desc: "",
            quiz_type: "",
          });
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  //Delete
  function deleteQuiz(id_quiz) {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this quiz!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        fetch(`http://localhost:3000/auth/quiz/${id_quiz}`, {
          headers: {
            Authorization: `Bearer ${[token]}`,
          },
          method: "DELETE",
        })
          .then((response) => {
            if (response.ok) {
              swal("Quiz has been deleted!", {
                icon: "success",
              }).then(() => {
                window.location.reload();
              });
            } else {
              swal("Failed to delete quiz", {
                icon: "error",
              });
            }
          })
          .catch((error) => {
            swal("Failed to delete quiz", {
              icon: "error",
            });
          });
      } else {
        swal("Quiz is safe!");
      }
    });
  }

  //Update Quiz
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateQuiz, setUpdateQuiz] = useState({});
  const handleShowUpdateModal = (id_quiz) => {
    const updateQuiz = quizzes.find((quiz) => quiz.id_quiz === id_quiz);
    setUpdateQuiz({ ...updateQuiz, id_quiz: id_quiz });
    setShowUpdateModal(true);
  };

  const handleUpdateCloseModal = () => setShowUpdateModal(false);
  const handleUpdate = (e, id_quiz) => {
    e.preventDefault(); // Prevent form submission

    const updatedData = {
      id_quiz: updateQuiz.id_quiz,
      id_user: updateQuiz.IDUser, // Menambahkan pengisian nilai id_user ke dalam objek updatedData
      quiz_name: updateQuiz.quiz_name,
      quiz_desc: updateQuiz.quiz_desc,
      quiz_type: updateQuiz.quiz_type,
    };

    axios
      .put(`http://localhost:3000/auth/quiz/${id_quiz}`, updatedData, {
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
  return (
    <div className="row">
      <div className="d-flex justify-content-end mt-0">
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleShowModal}
        >
          <i className="bi bi-plus"></i> Quiz
        </button>
      </div>

      <div className="row col-12 mt-4">
        {quizzes.map((quiz, index) => (
          <div className="col-xl-4 col-md-6" key={index}>
            <div className="card all-crs-wid">
              <div className="card-body">
                <div className="courses-bx">
                  <div className="dlab-info">
                    <div className="dlab-title d-flex justify-content-between">
                      <div>
                        <h4>
                          <Link to={`./quiz/${quiz.id_quiz}`}>
                            {quiz.quiz_name}
                          </Link>
                        </h4>
                        <p className="m-0">
                          {quiz.quiz_desc}
                          <svg
                            className="ms-1"
                            width="4"
                            height="5"
                            viewBox="0 0 4 5"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          ></svg>
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
                        {quiz.quiz_type}
                      </span>
                      {/* Button Update */}
                      <div className="d-flex justify-content-end">
                        <div className="ml-auto">
                          <button
                            type="button"
                            className="btn btn-link p-0"
                            onClick={() => handleShowUpdateModal(quiz.id_quiz)}
                          >
                            <i className="bi bi-pencil text-orange"></i>
                          </button>
                        </div>
                        {/* Button Delete */}
                        <div>
                          <button
                            type="button"
                            className="btn btn-link p-0 mx-2"
                            onClick={() => deleteQuiz(quiz.id_quiz)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>

                        {/* <div>
                          <Link
                            to={`./quiz/${quiz.id_quiz}`}
                            className="btn btn-primary btn-sm mx-2"
                          >
                            Detail
                          </Link>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Quiz */}
      <div className="row">
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add Quiz</Modal.Title>
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
                <Form.Label>Quiz Name</Form.Label>
                <Form.Control
                  type="text"
                  name="quiz_name"
                  value={formData.quiz_name}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="quiz_desc"
                  value={formData.quiz_desc}
                  onChange={handleInputChange}
                  maxLength={300}
                />
                <Form.Text className="text-muted">
                  {formData.quiz_desc.length}/300 characters
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Quiz Type</Form.Label>
                <Form.Control
                  type="text"
                  name="quiz_type"
                  value={formData.quiz_type}
                  onChange={handleInputChange}
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

      {/* Modal Update Quiz*/}
      <div className="row">
        <Modal show={showUpdateModal} onHide={handleUpdateCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Update Quiz</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={(e) => handleUpdate(e, updateQuiz.id_quiz)}>
              <Form.Group className="mb-3">
                <Form.Label>User</Form.Label>
                <Form.Control
                  as="select"
                  name="IDUser"
                  value={updateQuiz.IDUser}
                  onChange={(e) =>
                    setUpdateQuiz({
                      ...updateQuiz,
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
              <Form.Group className="mb-3">
                <Form.Label>Quiz Name</Form.Label>
                <Form.Control
                  type="text"
                  name="quiz_name"
                  value={updateQuiz.quiz_name}
                  onChange={(e) =>
                    setUpdateQuiz({
                      ...updateQuiz,
                      quiz_name: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="quiz_desc"
                  value={updateQuiz.quiz_desc}
                  onChange={(e) =>
                    setUpdateQuiz({
                      ...updateQuiz,
                      quiz_desc: e.target.value,
                    })
                  }
                  maxLength={300}
                />
                <Form.Text className="text-muted">
                  {formData.quiz_desc.length}/300 characters
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Quiz Type</Form.Label>
                <Form.Control
                  type="text"
                  name="quiz_type"
                  value={updateQuiz.quiz_type}
                  onChange={(e) =>
                    setUpdateQuiz({
                      ...updateQuiz,
                      quiz_type: e.target.value,
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

export default Quiz;

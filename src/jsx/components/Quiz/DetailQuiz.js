import { useEffect, useState } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Pagination from "react-bootstrap/Pagination";
import { Modal, Form, Button } from "react-bootstrap";
import swal from "sweetalert";

const QuizDetail = (props) => {
  const [quiz, setQuizID] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 1; // Ubah jumlah pertanyaan per halaman sesuai kebutuhan
  const id_quiz = props.match.params.id_quiz;
  const tokenDetailsString = localStorage.getItem("users");
  const tokenDetails = JSON.parse(tokenDetailsString);
  const token = tokenDetails.token;

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id_quiz: id_quiz,
    question_name: "",
  });
  const [showAnswerModal, setAnswerShowModal] = useState(false);
  const [formAnswerData, setFormAnswerData] = useState({
    id_question: "",
    answer_text: "",
  });
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/auth/quiz/${id_quiz}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setQuizID(response.data.data))
      .catch((error) => console.error(error));
  }, [token, id_quiz]);

  //Modal Function
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const handleAnswerCloseModal = () => setAnswerShowModal(false);
  const handleAnswerShowModal = (question) => {
    setSelectedQuestion(question);
    setFormAnswerData({
      id_question: question.id_question,
      answer_text: "",
    });
    setAnswerShowModal(true);
  };

  //Handling Funtion
  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleAnswerInputChange = (event) => {
    setFormAnswerData({
      ...formAnswerData,
      [event.target.name]: event.target.value,
    });
  };

  //Submit Function
  const handleSubmit = (event) => {
    event.preventDefault();
    // Mengirim data user ke API
    if (formData.question_name !== "" && formData.id_quiz) {
      // tambahkan kondisi formData.id_quiz
      const data = {
        id_quiz: parseInt(formData.id_quiz),
        question_name: formData.question_name,
      };

      axios
        .post("http://localhost:3000/auth/question/", data, {
          headers: {
            Authorization: `Bearer ${[token]}`,
          },
        })
        .then((response) => {
          console.log(response);
          // Mereset form setelah berhasil menambahkan question
          setFormData({
            id_quiz: "",
            question_name: "",
          });

          // Memperbarui quiz di state setelah berhasil menambahkan pertanyaan
          const updatedQuiz = { ...quiz };
          updatedQuiz.questions.push(response.data.data);
          setQuizID(updatedQuiz);

          // Menutup modal setelah berhasil menambahkan pertanyaan
          setShowModal(false);

          swal("Pertanyaan berhasil ditambahkan!", {
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
        })

        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleAnswerSubmit = (event) => {
    event.preventDefault();
    // Mengirim data user ke API
    if (formAnswerData.id_answer !== "") {
      const data = {
        id_question: parseInt(formAnswerData.id_question),
        answer_text: formAnswerData.answer_text,
      };

      axios
        .post("http://localhost:3000/auth/answer/", data, {
          headers: {
            Authorization: `Bearer ${[token]}`,
          },
        })
        .then((response) => {
          console.log(response);
          setFormAnswerData({
            id_question: "",
            answer_text: "",
          });
          // Memperbarui quiz di state setelah berhasil menambahkan jawaban
          setQuizID({
            ...quiz,
            questions: quiz.questions.map((q) => {
              if (q.id_question === formAnswerData.id_question) {
                return {
                  ...q,
                  answers: [...q.answers, response.data.data],
                };
              }
              return q;
            }),
          });
          setAnswerShowModal(false); // Menutup modal
          swal("Jawaban berhasil ditambahkan!", {
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const [answerId, setAnswerId] = useState("");
  const [score, setScore] = useState(0);
  const [numAnswered, setNumAnswered] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  // Function to check if all questions have been answered
  const checkQuizCompletion = () => {
    const numQuestions = quiz.questions && quiz.questions.length;
    return numAnswered === numQuestions;
  };

  // Function to handle submission of quiz
  const handleSubmitQuiz = () => {
    const numQuestions = quiz.questions && quiz.questions.length;
    const finalScore = Math.round((score / numQuestions) * 100);
    alert(`Your score is ${finalScore}%`);
  };

  // Function to handle radio button change
  const handleAnswerChange = (e, answer) => {
    setAnswerId(e.target.value);
    localStorage.setItem(`question-${answer.id_question}`, e.target.value);

    // Check if answer is correct and increment score
    if (answer.is_correct) {
      setScore(score + 1);
    }

    // Increment number of answered questions
    setNumAnswered(numAnswered + 1);

    // Check if quiz is completed
    if (checkQuizCompletion()) {
      setQuizCompleted(true);
    }
  };

  const indexOfLastQuestion = currentPage * perPage;
  const indexOfFirstQuestion = indexOfLastQuestion - perPage;
  const renderQuestions =
    quiz.questions &&
    quiz.questions
      .slice(indexOfFirstQuestion, indexOfLastQuestion)
      .map((question) => {
        const showAddAnswerButton =
          question.answers && question.answers.length < 4;

        return (
          <Card key={question.id_question} className="mb-3">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title>{question.question_name}</Card.Title>
              <div>
                <button
                  type="button"
                  className="btn btn-link p-0 mr-2"
                  onClick={() =>
                    handleShowUpdateQuestionModal(question.id_question)
                  }
                >
                  <i className="bi bi-pencil text-orange"></i>
                </button>
                <button
                  type="button"
                  className="btn btn-link p-0 mx-2"
                  onClick={() => deleteQuestion(question.id_question)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </Card.Header>

            <Card.Body>
              <ListGroup>
                {question.answers &&
                  question.answers.map((answer) => (
                    <ListGroup.Item
                      key={answer.id_answer}
                      className="d-flex align-items-center"
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`question-${question.id_question}`}
                        value={answer.id_answer}
                        onChange={(e) => handleAnswerChange(e, answer)}
                        checked={answerId === answer.id_answer}
                      />
                      &nbsp;&nbsp;
                      <span className="flex-grow-1 ml-2">
                        {answer.answer_text}
                      </span>
                      {/* Button Update Answer */}
                      <button
                        type="button"
                        className="btn btn-link p-0 ml-auto"
                        style={{ marginLeft: "10px" }}
                        onClick={() =>
                          handleShowUpdateAnswerModal(answer.id_answer)
                        }
                      >
                        <i className="bi bi-pencil text-orange"></i>
                      </button>
                      {/* Button Delete Answer */}
                      <button
                        type="button"
                        className="btn btn-link p-0 ml-auto"
                        style={{ marginLeft: "10px" }}
                        onClick={() => deleteAnswer(answer.id_answer)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </ListGroup.Item>
                  ))}
              </ListGroup>

              {showAddAnswerButton && (
                <button
                  className="btn btn-primary w-100 mt-3"
                  type="button"
                  onClick={() => handleAnswerShowModal(question)}
                >
                  <i className="bi bi-plus"></i> Jawaban
                </button>
              )}
            </Card.Body>
          </Card>
        );
      });

  const totalPages =
    quiz.questions && Math.ceil(quiz.questions.length / perPage);

  const renderPageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    renderPageNumbers.push(
      <Pagination.Item
        key={i}
        active={i === currentPage}
        onClick={() => setCurrentPage(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  // Update Question
  const [showUpdateQuestionModal, setShowUpdateQuestionModal] = useState(false);
  const [updateQuestion, setUpdateQuestion] = useState({});
  const handleShowUpdateQuestionModal = (id_question) => {
    const updateQuestion = quiz.questions.find(
      (question) => question.id_question === id_question
    );

    setUpdateQuestion({
      ...updateQuestion,
      id_question: id_question,
    });

    setShowUpdateQuestionModal(true);
  };

  const handleUpdateQuestionCloseModal = () =>
    setShowUpdateQuestionModal(false);
  const handleUpdateQuestion = (e, id_question) => {
    e.preventDefault(); // Prevent form submission

    const updatedData = {
      id_question: updateQuestion.id_question,
      question_name: updateQuestion.question_name,
    };

    axios
      .put(`http://localhost:3000/auth/question/${id_question}`, updatedData, {
        headers: {
          Authorization: `Bearer ${[token]}`,
        },
      })
      .then((response) => {
        console.log(response.data.updatedData);
        // Close modal and reload page to show updated data
        handleUpdateQuestionCloseModal();
        window.location.reload();
      })
      .catch((error) => console.log(error));
  };

  // Update Answer
  const [showUpdateAnswerModal, setShowUpdateAnswerModal] = useState(false);
  const [updateAnswer, setUpdateAnswer] = useState({});
  const handleShowUpdateAnswerModal = (id_answer) => {
    const updateAnswer = quiz.questions.reduce((prev, curr) => {
      const found = curr.answers.find(
        (answer) => answer.id_answer === id_answer
      );
      return found ? { question: curr, answer: found } : prev;
    }, {});
    setUpdateAnswer({ ...updateAnswer.answer, id_answer: id_answer });
    setShowUpdateAnswerModal(true);
  };

  const handleUpdateAnswerCloseModal = () => setShowUpdateAnswerModal(false);
  const handleUpdateAnswer = (e, id_answer) => {
    e.preventDefault(); // Prevent form submission

    const updatedData = {
      id_answer: updateAnswer.id_answer,
      answer_text: updateAnswer.answer_text,
    };

    axios
      .put(`http://localhost:3000/auth/answer/${id_answer}`, updatedData, {
        headers: {
          Authorization: `Bearer ${[token]}`,
        },
      })
      .then((response) => {
        console.log(response.data.updatedData);
        // Close modal and reload page to show updated data
        handleUpdateAnswerCloseModal();
        window.location.reload();
      })
      .catch((error) => console.log(error));
  };

  // Delete Question
  function deleteQuestion(id_question) {
    swal({
      title: "Apakah kamu yakin?",
      text: "Setelah dihapus, kamu tidak akan dapat mengembalikan pertanyaan ini!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        fetch(`http://localhost:3000/auth/question/${id_question}`, {
          headers: {
            Authorization: `Bearer ${[token]}`,
          },
          method: "DELETE",
        })
          .then((response) => {
            if (response.ok) {
              swal("Pertanyaan telah dihapus!", {
                icon: "success",
              }).then(() => {
                window.location.reload();
              });
            } else {
              swal("Gagal menghapus pertanyaan", {
                icon: "error",
              });
            }
          })
          .catch((error) => {
            swal("Gagal menghapus pertanyaan", {
              icon: "error",
            });
          });
      } else {
        swal("Pertanyaan diamankan!");
      }
    });
  }

  // Delete Answer
  function deleteAnswer(id_answer) {
    swal({
      title: "Apakah kamu yakin?",
      text: "Setelah dihapus, kamu tidak akan dapat mengembalikan jawaban ini!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        fetch(`http://localhost:3000/auth/answer/${id_answer}`, {
          headers: {
            Authorization: `Bearer ${[token]}`,
          },
          method: "DELETE",
        })
          .then((response) => {
            if (response.ok) {
              swal("Jawaban telah dihapus!", {
                icon: "success",
              }).then(() => {
                window.location.reload();
              });
            } else {
              swal("Gagal menghapus jawaban", {
                icon: "error",
              });
            }
          })
          .catch((error) => {
            swal("Gagal menghapus jawaban", {
              icon: "error",
            });
          });
      } else {
        swal("Jawaban diamankan!");
      }
    });
  }

  return (
    <div className="row">
      <h2>{quiz.quiz_name}</h2>
      <p>{quiz.quiz_desc}</p>
      <div className="d-flex justify-content-end mt-0">
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleShowModal}
        >
          <i className="bi bi-plus"></i> Pertanyaan
        </button>
      </div>

      <p>{quiz.quiz_type}</p>

      {renderQuestions}

      {/* Render finish button if quiz is completed */}
      {quizCompleted && (
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleSubmitQuiz}
        >
          Submit
        </button>
      )}
      <Pagination>{renderPageNumbers}</Pagination>

      {/* Modal Add Question */}
      <div className="row">
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Tambah Pertanyaan</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Quiz</Form.Label>
                <Form.Control
                  type="text"
                  name="quiz_name"
                  value={quiz.quiz_name}
                  disabled
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Pertanyaan</Form.Label>
                <Form.Control
                  type="text"
                  name="question_name"
                  value={formData.question_name}
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

      {/* Modal Update Question*/}
      <div className="row">
        <Modal
          show={showUpdateQuestionModal}
          onHide={handleUpdateQuestionCloseModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Question</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form
              onSubmit={(e) =>
                handleUpdateQuestion(e, updateQuestion.id_question)
              }
            >
              <Form.Group className="mb-3">
                <Form.Label>Question</Form.Label>
                <Form.Control
                  type="text"
                  name="question_name"
                  value={updateQuestion.question_name}
                  onChange={(e) =>
                    setUpdateQuestion({
                      ...updateQuestion,
                      question_name: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <div className="text-end mt-3">
                <Button variant="primary" type="submit">
                  Edit
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </div>

      {/* Modal Add Answer */}
      <div className="row">
        {selectedQuestion && (
          <Modal show={showAnswerModal} onHide={handleAnswerCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Tambah Jawaban</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                <strong>{selectedQuestion.question_name}</strong>
              </p>

              <Form onSubmit={handleAnswerSubmit}>
                <Form.Group controlId="formAnswer" className="mb-3">
                  <Form.Label>Jawaban</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter answer text"
                    name="answer_text"
                    value={formAnswerData.answer_text}
                    onChange={handleAnswerInputChange}
                    required
                  />
                </Form.Group>
                <div className="text-end mt-3">
                  <Button variant="primary" type="submit">
                    Tambah
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>
        )}
      </div>

      {/* Modal Update Answer*/}
      <div className="row">
        <Modal
          show={showUpdateAnswerModal}
          onHide={handleUpdateAnswerCloseModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Jawaban</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form
              onSubmit={(e) => handleUpdateAnswer(e, updateAnswer.id_answer)}
            >
              <Form.Group className="mb-3">
                <Form.Label>Jawaban</Form.Label>
                <Form.Control
                  type="text"
                  name="answer_text"
                  value={updateAnswer.answer_text}
                  onChange={(e) =>
                    setUpdateAnswer({
                      ...updateAnswer,
                      answer_text: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <div className="text-end mt-3">
                <Button variant="primary" type="submit">
                  Edit
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default QuizDetail;

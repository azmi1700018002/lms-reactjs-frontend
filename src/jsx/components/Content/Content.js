import React, { useState, useEffect } from "react";
import axios from "axios";
import { Accordion, Modal, Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Dropdown } from "react-bootstrap";
import "react-modal-video/css/modal-video.min.css";
import swal from "sweetalert";

const Content = ({ idsection, content_type }) => {
  const [smallCardData, setSmallCardData] = useState([]);
  const [accordionBlog, setAccordionBlog] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const [sectionOptions, setSectionOptions] = useState([]);

  // Token from local storage
  const tokenDetailsString = localStorage.getItem("users");
  const tokenDetails = JSON.parse(tokenDetailsString);
  const token = tokenDetails.token;

  useEffect(() => {
    // Get Content
    axios
      .get("http://localhost:3000/auth/content", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response && response.data && response.data.data) {
          setSmallCardData(response.data.data);
        } else {
          console.error("Invalid response from server:", response);
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.status === 401) {
          console.error("Unauthorized access. Please check your token.");
        } else {
          console.error("Error fetching data from server:", error);
        }
      });

    // Get Section
    axios
      .get("http://localhost:3000/auth/section", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setAccordionBlog(response.data.data);
        setSectionOptions(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [token]);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  // Add Section
  const handleShowSectionModal = () => setShowSectionModal(true);
  const handleCloseSectionModal = () => setShowSectionModal(false);
  const [formData, setFormData] = useState({
    idsection: idsection,
    content_title: "",
    content_type: content_type,
    image: "",
    link: "",
  });
  const [showSectionModal, setShowSectionModal] = useState(false);
  const postDataSection = () => {
    const sectionData = {
      section_title: formData.section_title,
    };

    axios
      .post("http://localhost:3000/auth/section/", sectionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setFormData({
          section_title: "",
        });
        setShowSectionModal(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Add Content
  const handleShowContentModal = () => setShowContentModal(true);
  const handleCloseContentModal = () => setShowContentModal(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const postDataContent = () => {
    const contentData = {
      idsection: parseInt(formData.idsection),
      content_title: formData.content_title,
      content_type: parseInt(formData.content_type),
      image: formData.image,
      link: formData.link,
    };

    axios
      .post("http://localhost:3000/auth/content/", contentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setFormData({
          idsection: idsection,
          content_title: "",
          content_type: content_type,
          image: "",
          link: "",
        });
        setShowContentModal(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Update Section
  const [showUpdateSectionModal, setShowUpdateSectionModal] = useState(false);
  const [updateSection, setUpdateSection] = useState({});

  const handleShowUpdateSectionModal = (idsection) => {
    const updateSection = accordionBlog.find(
      (accordion) => accordion.idsection === idsection
    );
    setUpdateSection({ ...updateSection, idsection: idsection });
    setShowUpdateSectionModal(true);
  };

  const handleUpdateCloseSectionModal = () => setShowUpdateSectionModal(false);
  const handleUpdateSection = (e, idsection) => {
    e.preventDefault();

    const updatedData = {
      idsection: updateSection.idsection,
      section_title: updateSection.section_title,
    };

    axios
      .put(`http://localhost:3000/auth/section/${idsection}`, updatedData, {
        headers: {
          Authorization: `Bearer ${[token]}`,
        },
      })
      .then((response) => {
        console.log(response.data.updatedData);
        handleUpdateCloseModal();
        window.location.reload();
      })
      .catch((error) => console.log(error));
  };

  // Update Content
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateContent, setUpdateContent] = useState({});

  const handleShowUpdateModal = (idcontent) => {
    const updateContent = smallCardData.find(
      (card) => card.idcontent === idcontent
    );
    setUpdateContent({ ...updateContent, idcontent: idcontent });
    setShowUpdateModal(true);
  };

  const handleUpdateCloseModal = () => setShowUpdateModal(false);
  const handleUpdate = (e, idcontent) => {
    e.preventDefault();

    const updatedData = {
      idcontent: updateContent.idcontent,
      idsection: parseInt(updateContent.idsection),
      content_title: updateContent.content_title,
      content_type: parseInt(updateContent.content_type),
      image: updateContent.image,
      link: updateContent.link,
    };

    axios
      .put(`http://localhost:3000/auth/content/${idcontent}`, updatedData, {
        headers: {
          Authorization: `Bearer ${[token]}`,
        },
      })
      .then((response) => {
        console.log(response.data.updatedData);
        handleUpdateCloseModal();
        window.location.reload();
      })
      .catch((error) => console.log(error));
  };

  const handleClick = (card) => {
    setActiveCard(card.id === activeCard?.id ? null : card);
    if (card === activeCard) {
      setActiveCard(null);
    } else {
      setActiveCard(card);
    }
  };

  //Delete Content
  function deleteContent(idcontent) {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this content!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        fetch(`http://localhost:3000/auth/content/${idcontent}`, {
          headers: {
            Authorization: `Bearer ${[token]}`,
          },
          method: "DELETE",
        })
          .then((response) => {
            if (response.ok) {
              swal("Content has been deleted!", {
                icon: "success",
              }).then(() => {
                window.location.reload();
              });
            } else {
              swal("Failed to delete content", {
                icon: "error",
              });
            }
          })
          .catch((error) => {
            swal("Failed to delete section", {
              icon: "error",
            });
          });
      } else {
        swal("Content is safe!");
      }
    });
  }

  //Delete Section
  function deleteSection(idsection) {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this section!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        fetch(`http://localhost:3000/auth/section/${idsection}`, {
          headers: {
            Authorization: `Bearer ${[token]}`,
          },
          method: "DELETE",
        })
          .then((response) => {
            if (response.ok) {
              swal("Section has been deleted!", {
                icon: "success",
              }).then(() => {
                window.location.reload();
              });
            } else {
              swal("Failed to delete section", {
                icon: "error",
              });
            }
          })
          .catch((error) => {
            swal("Failed to delete section", {
              icon: "error",
            });
          });
      } else {
        swal("Section is safe!");
      }
    });
  }
  //Alert SWAL
  function showAlert() {
    return new Promise((resolve, reject) => {
      swal({
        title: "Are you sure?",
        text: "Once added, Make sure your data is correct",
        icon: "warning",
        buttons: ["Cancel", "Add"],
      }).then((value) => {
        if (value) {
          resolve();
        } else {
          reject();
        }
      });
    });
  }

  async function handleAddSectionClick() {
    try {
      await showAlert();
      postDataSection();
    } catch (error) {
      console.log("User clicked cancel");
    }
  }

  async function handleAddContentClick() {
    try {
      await showAlert();
      postDataContent();
    } catch (error) {
      console.log("User clicked cancel");
    }
  }

  return (
    <>
      <div className="row">
        <div className="col-xl-8 col-xxl-7">
          <div className="card">
            <div className="card-body">
              <div className="course-content d-flex justify-content-between flex-wrap">
                <div>
                  {activeCard && activeCard.content_title && (
                    <div>
                      <h4>{activeCard.content_title}</h4>
                    </div>
                  )}
                </div>
              </div>
              {activeCard && activeCard.link && (
                <div className="embed-responsive embed-responsive-16by9 mt-4 text-center">
                  <iframe
                    className="embed-responsive-item"
                    width="100%"
                    height="315"
                    src={activeCard.link}
                    allowfullscreen
                    title="YouTube video player"
                  ></iframe>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-xxl-5">
          <div className="card h-auto">
            <div className="card-header border-0 pb-0">
              <h4>Progress</h4>
              <Dropdown>
                <Dropdown.Toggle
                  as="a"
                  className="btn-link i-false btn sharp tp-btn-light btn-dark"
                >
                  <svg
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.0012 9.86C11.6544 9.86 11.3109 9.92832 10.9905 10.061C10.67 10.1938 10.3789 10.3883 10.1336 10.6336C9.88835 10.8788 9.6938 11.17 9.56107 11.4905C9.42834 11.8109 9.36002 12.1544 9.36002 12.5012C9.36002 12.848 9.42834 13.1915 9.56107 13.5119C9.6938 13.8324 9.88835 14.1236 10.1336 14.3688C10.3789 14.6141 10.67 14.8086 10.9905 14.9413C11.3109 15.0741 11.6544 15.1424 12.0012 15.1424C12.7017 15.1422 13.3734 14.8638 13.8687 14.3684C14.3639 13.873 14.642 13.2011 14.6418 12.5006C14.6417 11.8001 14.3632 11.1284 13.8678 10.6332C13.3724 10.138 12.7005 9.85984 12 9.86H12.0012ZM3.60122 9.86C3.25437 9.86 2.91092 9.92832 2.59048 10.061C2.27003 10.1938 1.97887 10.3883 1.73361 10.6336C1.48835 10.8788 1.2938 11.17 1.16107 11.4905C1.02834 11.8109 0.960022 12.1544 0.960022 12.5012C0.960022 12.848 1.02834 13.1915 1.16107 13.5119C1.2938 13.8324 1.48835 14.1236 1.73361 14.3688C1.97887 14.6141 2.27003 14.8086 2.59048 14.9413C2.91092 15.0741 3.25437 15.1424 3.60122 15.1424C4.30171 15.1422 4.97345 14.8638 5.46866 14.3684C5.96387 13.873 6.24198 13.2011 6.24182 12.5006C6.24166 11.8001 5.96324 11.1284 5.46781 10.6332C4.97237 10.138 4.30051 9.85984 3.60002 9.86H3.60122ZM20.4012 9.86C20.0544 9.86 19.7109 9.92832 19.3905 10.061C19.07 10.1938 18.7789 10.3883 18.5336 10.6336C18.2884 10.8788 18.0938 11.17 17.9611 11.4905C17.8283 11.8109 17.76 12.1544 17.76 12.5012C17.76 12.848 17.8283 13.1915 17.9611 13.5119C18.0938 13.8324 18.2884 14.1236 18.5336 14.3688C18.7789 14.6141 19.07 14.8086 19.3905 14.9413C19.7109 15.0741 20.0544 15.1424 20.4012 15.1424C21.1017 15.1422 21.7734 14.8638 22.2687 14.3684C22.7639 13.873 23.042 13.2011 23.0418 12.5006C23.0417 11.8001 22.7632 11.1284 22.2678 10.6332C21.7724 10.138 21.1005 9.85984 20.4 9.86H20.4012Z"
                      fill="#A098AE"
                    />
                  </svg>
                </Dropdown.Toggle>
                <Dropdown.Menu
                  className="dropdown-menu dropdown-menu-end"
                  align="right"
                >
                  <Dropdown.Item>Delete</Dropdown.Item>
                  <Dropdown.Item>Edit</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="card-body pt-0">
              <div className="progress-box">
                <div className="progress ">
                  <div
                    className="progress-bar bg-primary"
                    style={{
                      width: "15%",
                      height: "12px",
                      borderRadius: "4px",
                    }}
                    role="progressbar"
                  ></div>
                </div>

                <div className="d-flex align-items-center justify-content-between">
                  <h5 className="mb-0 fs-14 font-w600">
                    Full-Stack Web Developer
                  </h5>
                  <span className="font-w600">10/110</span>
                </div>
              </div>
            </div>
          </div>
          <div className="custome-accordion">
            <div className="d-flex justify-content-end mb-3">
              <Button
                variant="primary"
                onClick={handleShowSectionModal}
                id="section-button"
                style={{ marginRight: "10px" }}
              >
                Add Section
              </Button>
              <Button
                variant="secondary"
                onClick={handleShowContentModal}
                id="content-button"
                data-target="#content-modal"
              >
                Add Content
              </Button>
            </div>

            <Accordion className="accordion" defaultActiveKey="0">
              {accordionBlog.map((data, i) => (
                <Accordion.Item className="card" key={i} eventKey={`${i}`}>
                  <Accordion.Header
                    as="h2"
                    className="accordion-header border-0"
                  >
                    <Dropdown>
                      <Dropdown.Toggle
                        as="a"
                        className="btn-link i-false btn sharp tp-btn-light btn-dark"
                      >
                        <svg
                          width="24"
                          height="25"
                          viewBox="0 0 24 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.0012 9.86C11.6544 9.86 11.3109 9.92832 10.9905 10.061C10.67 10.1938 10.3789 10.3883 10.1336 10.6336C9.88835 10.8788 9.6938 11.17 9.56107 11.4905C9.42834 11.8109 9.36002 12.1544 9.36002 12.5012C9.36002 12.848 9.42834 13.1915 9.56107 13.5119C9.6938 13.8324 9.88835 14.1236 10.1336 14.3688C10.3789 14.6141 10.67 14.8086 10.9905 14.9413C11.3109 15.0741 11.6544 15.1424 12.0012 15.1424C12.7017 15.1422 13.3734 14.8638 13.8687 14.3684C14.3639 13.873 14.642 13.2011 14.6418 12.5006C14.6417 11.8001 14.3632 11.1284 13.8678 10.6332C13.3724 10.138 12.7005 9.85984 12 9.86H12.0012ZM3.60122 9.86C3.25437 9.86 2.91092 9.92832 2.59048 10.061C2.27003 10.1938 1.97887 10.3883 1.73361 10.6336C1.48835 10.8788 1.2938 11.17 1.16107 11.4905C1.02834 11.8109 0.960022 12.1544 0.960022 12.5012C0.960022 12.848 1.02834 13.1915 1.16107 13.5119C1.2938 13.8324 1.48835 14.1236 1.73361 14.3688C1.97887 14.6141 2.27003 14.8086 2.59048 14.9413C2.91092 15.0741 3.25437 15.1424 3.60122 15.1424C4.30171 15.1422 4.97345 14.8638 5.46866 14.3684C5.96387 13.873 6.24198 13.2011 6.24182 12.5006C6.24166 11.8001 5.96324 11.1284 5.46781 10.6332C4.97237 10.138 4.30051 9.85984 3.60002 9.86H3.60122ZM20.4012 9.86C20.0544 9.86 19.7109 9.92832 19.3905 10.061C19.07 10.1938 18.7789 10.3883 18.5336 10.6336C18.2884 10.8788 18.0938 11.17 17.9611 11.4905C17.8283 11.8109 17.76 12.1544 17.76 12.5012C17.76 12.848 17.8283 13.1915 17.9611 13.5119C18.0938 13.8324 18.2884 14.1236 18.5336 14.3688C18.7789 14.6141 19.07 14.8086 19.3905 14.9413C19.7109 15.0741 20.0544 15.1424 20.4012 15.1424C21.1017 15.1422 21.7734 14.8638 22.2687 14.3684C22.7639 13.873 23.042 13.2011 23.0418 12.5006C23.0417 11.8001 22.7632 11.1284 22.2678 10.6332C21.7724 10.138 21.1005 9.85984 20.4 9.86H20.4012Z"
                            fill="#A098AE"
                          />
                        </svg>
                      </Dropdown.Toggle>
                      <Dropdown.Menu
                        className="dropdown-menu dropdown-menu-end"
                        align="right"
                      >
                        <Dropdown.Item
                          onClick={() => deleteSection(data.idsection)}
                        >
                          Delete
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            handleShowUpdateSectionModal(data.idsection)
                          }
                        >
                          Edit
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    <span className="acc-heading">{data.section_title}</span>
                    <span className="ms-auto">
                      {`${
                        smallCardData.filter(
                          (card) => card.idsection === data.idsection
                        ).length
                      } Materi`}
                    </span>
                  </Accordion.Header>
                  <Accordion.Collapse eventKey={`${i}`} id="collapseOne">
                    <div className="accordion-body card-body pt-0">
                      {smallCardData
                        .filter((card) => card.idsection === data.idsection)
                        .map((card, j) => (
                          <div
                            key={j}
                            className={`acc-courses my-3 ${
                              card === activeCard ? "active" : ""
                            }`}
                            onClick={() => handleClick(card)}
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center">
                                <span className="acc-icon">
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M4 13C3.817 13 3.635 12.95 3.474 12.851C3.32918 12.7611 3.20965 12.6358 3.12671 12.4869C3.04378 12.338 3.00016 12.1704 3 12V4C3 3.653 3.18 3.331 3.474 3.149C3.61914 3.05976 3.7846 3.00891 3.95481 3.00121C4.12502 2.99351 4.29439 3.02923 4.447 3.105L12.447 7.105C12.6131 7.1882 12.7528 7.31599 12.8504 7.47405C12.948 7.63212 12.9997 7.81423 12.9997 8C12.9997 8.18578 12.948 8.36789 12.8504 8.52595C12.7528 8.68402 12.6131 8.8118 12.447 8.895L4.447 12.895C4.307 12.965 4.152 13 4 13Z"
                                      fill="var(--primary)"
                                    />
                                  </svg>
                                </span>
                                <h4 className="m-0">{card.content_title}</h4>
                              </div>
                              <Dropdown>
                                <Dropdown.Toggle
                                  as="a"
                                  className="btn-link i-false btn sharp tp-btn-light btn-dark"
                                >
                                  <svg
                                    width="24"
                                    height="25"
                                    viewBox="0 0 24 25"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M12.0012 9.86C11.6544 9.86 11.3109 9.92832 10.9905 10.061C10.67 10.1938 10.3789 10.3883 10.1336 10.6336C9.88835 10.8788 9.6938 11.17 9.56107 11.4905C9.42834 11.8109 9.36002 12.1544 9.36002 12.5012C9.36002 12.848 9.42834 13.1915 9.56107 13.5119C9.6938 13.8324 9.88835 14.1236 10.1336 14.3688C10.3789 14.6141 10.67 14.8086 10.9905 14.9413C11.3109 15.0741 11.6544 15.1424 12.0012 15.1424C12.7017 15.1422 13.3734 14.8638 13.8687 14.3684C14.3639 13.873 14.642 13.2011 14.6418 12.5006C14.6417 11.8001 14.3632 11.1284 13.8678 10.6332C13.3724 10.138 12.7005 9.85984 12 9.86H12.0012ZM3.60122 9.86C3.25437 9.86 2.91092 9.92832 2.59048 10.061C2.27003 10.1938 1.97887 10.3883 1.73361 10.6336C1.48835 10.8788 1.2938 11.17 1.16107 11.4905C1.02834 11.8109 0.960022 12.1544 0.960022 12.5012C0.960022 12.848 1.02834 13.1915 1.16107 13.5119C1.2938 13.8324 1.48835 14.1236 1.73361 14.3688C1.97887 14.6141 2.27003 14.8086 2.59048 14.9413C2.91092 15.0741 3.25437 15.1424 3.60122 15.1424C4.30171 15.1422 4.97345 14.8638 5.46866 14.3684C5.96387 13.873 6.24198 13.2011 6.24182 12.5006C6.24166 11.8001 5.96324 11.1284 5.46781 10.6332C4.97237 10.138 4.30051 9.85984 3.60002 9.86H3.60122ZM20.4012 9.86C20.0544 9.86 19.7109 9.92832 19.3905 10.061C19.07 10.1938 18.7789 10.3883 18.5336 10.6336C18.2884 10.8788 18.0938 11.17 17.9611 11.4905C17.8283 11.8109 17.76 12.1544 17.76 12.5012C17.76 12.848 17.8283 13.1915 17.9611 13.5119C18.0938 13.8324 18.2884 14.1236 18.5336 14.3688C18.7789 14.6141 19.07 14.8086 19.3905 14.9413C19.7109 15.0741 20.0544 15.1424 20.4012 15.1424C21.1017 15.1422 21.7734 14.8638 22.2687 14.3684C22.7639 13.873 23.042 13.2011 23.0418 12.5006C23.0417 11.8001 22.7632 11.1284 22.2678 10.6332C21.7724 10.138 21.1005 9.85984 20.4 9.86H20.4012Z"
                                      fill="#A098AE"
                                    />
                                  </svg>
                                </Dropdown.Toggle>
                                <Dropdown.Menu
                                  className="dropdown-menu dropdown-menu-end"
                                  align="right"
                                >
                                  <Dropdown.Item
                                    onClick={() =>
                                      deleteContent(card.idcontent)
                                    }
                                  >
                                    Delete
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={() =>
                                      handleShowUpdateModal(card.idcontent)
                                    }
                                  >
                                    Update
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </div>
                          </div>
                        ))}
                    </div>
                  </Accordion.Collapse>
                </Accordion.Item>
              ))}
            </Accordion>
          </div>

          {/* Section Add Modal */}
          <Modal
            show={showSectionModal}
            onHide={handleCloseSectionModal}
            id="section-modal"
          >
            <Modal.Header closeButton>
              <Modal.Title>Add Section</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <div className="form-group">
                  <label>Section Title:</label>
                  <input
                    type="text"
                    name="section_title"
                    value={formData.section_title}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={handleCloseSectionModal}>
                Close
              </Button>
              <Button variant="success" onClick={handleAddSectionClick}>
                Add
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Content Add Modal */}
          <Modal
            show={showContentModal}
            onHide={handleCloseContentModal}
            id="content-modal"
          >
            <Modal.Header closeButton>
              <Modal.Title>Add Content</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <div className="form-group">
                  <label>Section:</label>
                  {sectionOptions.length > 0 ? (
                    <select
                      name="idsection"
                      value={formData.idsection}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="">-- Select a section --</option>
                      {sectionOptions.map((option) => (
                        <option key={option.idsection} value={option.idsection}>
                          {option.section_title}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p>Loading sections...</p>
                  )}
                </div>

                <label>Content Title</label>
                <input
                  type="text"
                  name="content_title"
                  value={formData.content_title}
                  onChange={handleChange}
                  className="form-control"
                />

                <label>Content Type</label>
                <select
                  name="content_type"
                  value={formData.content_type}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">-- Select Content Type --</option>
                  <option value="1">Video</option>
                  <option value="2">Quiz</option>
                  <option value="3">File</option>
                  <option value="4">Link</option>
                </select>

                <label>Image</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  accept="image/*"
                  className="form-control"
                />

                <label>Link</label>
                <input
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  className="form-control"
                />
              </form>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="danger" onClick={handleCloseContentModal}>
                Close
              </Button>
              <Button variant="success" onClick={handleAddContentClick}>
                Add
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Modal Update Section */}
          <div className="row">
            <Modal
              show={showUpdateSectionModal}
              onHide={handleUpdateCloseSectionModal}
            >
              <Modal.Header closeButton>
                <Modal.Title>Update Section</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form
                  onSubmit={(e) =>
                    handleUpdateSection(e, updateSection.idsection)
                  }
                >
                  <Form.Group className="mb-3">
                    <Form.Label>Section Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="section_title"
                      value={updateSection.section_title}
                      onChange={(e) =>
                        setUpdateSection({
                          ...updateSection,
                          section_title: e.target.value,
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

          {/* Modal Update Content */}
          <div className="row">
            <Modal show={showUpdateModal} onHide={handleUpdateCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>Update Content</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form
                  onSubmit={(e) => handleUpdate(e, updateContent.idcontent)}
                >
                  <Form.Group className="mb-3">
                    <Form.Label>Section</Form.Label>
                    <Form.Control
                      as="select"
                      name="idsection"
                      value={updateContent.idsection}
                      onChange={(e) =>
                        setUpdateContent({
                          ...updateContent,
                          idsection: e.target.value,
                        })
                      }
                    >
                      <option value="">- Select a section -</option>
                      {sectionOptions.map((option) => (
                        <option key={option.idsection} value={option.idsection}>
                          {option.section_title}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Content Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="content_title"
                      value={updateContent.content_title}
                      onChange={(e) =>
                        setUpdateContent({
                          ...updateContent,
                          content_title: e.target.value,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Content Type</Form.Label>
                    <Form.Control
                      as="select"
                      name="content_type"
                      value={updateContent.content_type}
                      onChange={(e) =>
                        setUpdateContent({
                          ...updateContent,
                          content_type: e.target.value,
                        })
                      }
                    >
                      <option value="">-- Select Content Type --</option>
                      <option value="1">Video</option>
                      <option value="2">Quiz</option>
                      <option value="3">File</option>
                      <option value="4">Link</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                      type="text"
                      name="image"
                      value={updateContent.image}
                      onChange={(e) =>
                        setUpdateContent({
                          ...updateContent,
                          image: e.target.value,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Link</Form.Label>
                    <Form.Control
                      type="text"
                      name="link"
                      value={updateContent.link}
                      onChange={(e) =>
                        setUpdateContent({
                          ...updateContent,
                          link: e.target.value,
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
      </div>
    </>
  );
};

export default Content;

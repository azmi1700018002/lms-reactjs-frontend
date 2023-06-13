import React, { Fragment,  useRef,useState, useEffect } from "react";
import PageTitle from "../../layouts/PageTitle";
import axios from 'axios';
import { Link } from "react-router-dom";
import { Row, Card, Col, Button, Modal, Container } from "react-bootstrap";
import swal from "sweetalert";

const DataTable = () => {

  const token = localStorage.getItem('users');
  const tokenJson = JSON.parse(token);
  const userToken = tokenJson.idToken;


  const [users, setUsers] = useState({});
  const [complete, setComplete] = useState(false);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState([{val:"",col:""}]);
  const [addModal, setaddModal] = useState(false);
  const [editModal, seteditModal] = useState(false);

  
  const [username, setUsername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");


  const [edit_id_pengetahuan, setedit_Id_pengetahuan] = useState("");
  const [edit_username, setedit_username] = useState("");
  const [edit_email, setedit_email] = useState("");




  const postData = {
    page:page,
    filter:filter
  };
  const postDataJson = JSON.stringify(postData);
  
  const getUserList = () => {
    axios.post(`http://localhost:3000/auth/users/`,postDataJson).then(res => { 
      setUsers(res.data.ResponseData);
      setComplete(true);
    }).catch(err => {
        setUsers({});
    });
  }

  useEffect(() => {
    getUserList();
  }, [page]);



  function handleFilter(val,col) {
    setFilter(arr => [...arr,{val:val,col:col}])
  }
  
  useEffect(() => {
    //console.log(filter);
    if(filter.length>1){
      const timeOutId = setTimeout(() => getUserList(), 500);
      return () => clearTimeout(timeOutId);
    }
  }, [filter]);


  if(complete==false){
    return (<div>Loading</div>);
  }


  const sort = users.per_page;
  let paggination = users.arr_page
  const onClick = (i) => {};

  const simpanData = () =>{
    const formData = new FormData();

    formData.append("username",username); 
    formData.append("email",email);
    formData.append("password",password);

    
    fetch('http://localhost:3000/auth/users/',{
          method: "post",
          body: formData,
          headers: {"Authorization": `Bearer ${userToken}`},
          withCredentials: true,  
          crossorigin: true,  
        })
        .then((response) => response.json())
        .then((resInsert) => {
          console.log(resInsert);
    });
    
    setaddModal(false)
  }

  function handleEdit(id) {

    fetch('http://localhost:3000/auth/users'+id,{
          method: "get",
          headers: {"Authorization": `Bearer ${userToken}`},
          withCredentials: true,  
          crossorigin: true,  
        })
        .then((response) => response.json())
        .then((resData) => {
          if(resData.ResponseCode==200){
            setedit_Id_pengetahuan(resData.ResponseData.id_pengetahuan)
            setedit_username(resData.ResponseData.username)
            setedit_email(resData.ResponseData.email)
            seteditModal(true)
          }else{
            swal("Oops", "Terjadi Kesalahan!", "error")
          }
    });

  }

  const ubahData = () =>{

    const formData = new FormData();

    formData.append("id_pengetahuan",edit_id_pengetahuan);
    formData.append("username",edit_username); 
    formData.append("email",edit_email);
    fetch('http://localhost:3000/auth/users'+edit_id_pengetahuan,{
          method: "post",
          body: formData,
          headers: {"Authorization": `Bearer ${userToken}`},
          withCredentials: true,  
          crossorigin: true,  
        })
        .then((response) => response.json())
        .then((resInsert) => {
          console.log(resInsert);
    });
    
    
    setaddModal(false)
  }

  return (
    <Fragment>
      <PageTitle
        activeMenu="Pengetahuan"
        motherMenu=""
        pageContent="Pengetahuan"
      />
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Data Pengetahuan</h4>
              <Button
                  variant="primary"
                  className="mb-2 me-2"
                  onClick={() => setaddModal(true)}
                >
                  Tambah Pengetahuan
              </Button>
              <Modal
                  className="fade bd-example-modal-lg"
                  show={addModal}
                  size="lg"
                >
                  <Modal.Header>
                    <Modal.Title>Penambahan Data Pengetahuan Baru</Modal.Title>
                    <Button
                      variant=""
                      className="btn-close"
                      onClick={() => setaddModal(false)}
                    >
                      
                    </Button>
                  </Modal.Header>
                  <Modal.Body>
                  
                    <div className="basic-form">
                      <form onSubmit={(e) => e.preventDefault()}>

                        <div className="mb-3 row">
                          <label className="col-sm-3 col-form-label">username</label>
                          <div className="col-sm-9">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="username"
                              onChange={(e) => setUsername(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="mb-3 row">
                          <label className="col-sm-3 col-form-label">password Singkat</label>
                          <div className="col-sm-9">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="password Singkat"
                              onChange={(e) => setemail(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="mb-3 row">
                          <label className="col-sm-3 col-form-label">password</label>
                          <div className="col-sm-9">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="password"
                              onChange={(e) => setpassword(e.target.value)}
                            />
                          </div>
                        </div>

                      </form>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="danger light"
                      onClick={() => setaddModal(false)}
                    >
                      Close
                    </Button>
                    <Button
                      variant=""
                      type="button"
                      className="btn btn-primary"
                      onClick={() => simpanData()}
                    >
                      Save changes
                    </Button>
                  </Modal.Footer>
              </Modal>
            </div>
            <div className="card-body">
              <div className="w-100 table-responsive">
                <div id="example_wrapper" className="dataTables_wrapper">
                  <table id="example" className="display w-100 dataTable">
                    <thead>
                      <tr role="row">
                        {users.columns.map((d, i) => (
                          <th key={i}>{d}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {users.data.map((d, i) => (
                        <tr key={i}>
                          {d.map((da, i) => (
                            <Fragment key={i}>
                              <td>
                                  <Fragment>
                                    {i < users.total_column_number && (da)}

                                    {i == users.total_column_number && (
                                      <div className="d-flex">
                                        <Link
                                          to="#"
                                          className="btn btn-primary shadow btn-xs sharp me-1"
                                          onClick={() => handleEdit(da)}
                                        >
                                        <i className="fas fa-pencil-alt"></i>
                                        </Link>
                                        <Link
                                          to="#"
                                          className="btn btn-danger shadow btn-xs sharp"
                                        >
                                          <i className="fa fa-trash"></i>
                                        </Link>
                                      </div>
                                    )}
                                  </Fragment>
                              </td>
                            </Fragment>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr role="row">
                        {users.columns.map((d, i) => (
                          users.columns_search.indexOf(d) > -1 ? (
                          <th key={i}>
                            <input key={i} name={d}
                              className="form-control form-control-sm"
                              type="text"
                              onChange={e => handleFilter(e.target.value,d)} 
                              />
                          </th>
                          ) : (
                          <th key={i}></th>
                          )
                        ))}
                      </tr>
                    </tfoot>
                    
                  </table>

                  <div className="d-sm-flex text-center justify-content-between align-items-center mt-3 mb-2">
                    <div className="dataTables_info">
                      Showing {users.from_row } to{" "}
                      {users.to_row}{" "}
                      of {users.total} entries
                    </div>
                    <div
                      className="dataTables_paginate paging_simple_numbers mb-0"
                      id="example5_paginate"
                    >
                      <Link
                        className="paginate_button previous disabled"
                        to="#"
                        onClick={() =>
                          page > 1 && onClick(setPage(page-1))
                        }
                      >
                        <i className="fa fa-angle-double-left" aria-hidden="true"></i>
                      </Link>
                      <span>
                        {paggination.map((number, i) => (
                          <Link
                            key={number}
                            to="#"
                            className={`paginate_button  ${
                              page === number ? "current" : ""
                            } `}
                            onClick={() => setPage(number)}
                          >
                            {number}
                          </Link>
                        ))}
                      </span>
                      <Link
                        className="paginate_button next"
                        to="#"
                        onClick={() =>
                          page < paggination.length &&
                          onClick(setPage(page+1))
                        }
                      >
                        <i className="fa fa-angle-double-right" aria-hidden="true"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        className="fade bd-example-modal-lg"
        show={editModal}
        size="lg"
      >
        <Modal.Header>
          <Modal.Title>Perubahan Data Pengetahuan</Modal.Title>
          <Button
            variant=""
            className="btn-close"
            onClick={() => seteditModal(false)}
          >
            
          </Button>
        </Modal.Header>
        <Modal.Body>
        
          <div className="basic-form">
            <form onSubmit={(e) => e.preventDefault()}>

                <div className="mb-3 row">
                  <label className="col-sm-3 col-form-label">username</label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="username"
                      value={edit_username}
                      onChange={(e) => setedit_username(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-3 row">
                  <label className="col-sm-3 col-form-label">password Singkat</label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="password Singkat"
                      value={edit_email}
                      onChange={(e) => setedit_email(e.target.value)}
                    />
                  </div>
                </div>

            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger light"
            onClick={() => seteditModal(false)}
          >
            Close
          </Button>
          <Button
            variant=""
            type="button"
            className="btn btn-primary"
            onClick={() => ubahData()}
          >
            Save changes
          </Button>
        </Modal.Footer>
    </Modal>
    </Fragment>
  );
};

export default DataTable;

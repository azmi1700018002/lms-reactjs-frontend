import React, { Fragment,  useRef,useState, useEffect } from "react";
// import { Table, Pagination } from "react-bootstrap";
import axios from 'axios';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";


const ProfileDatatable = () => {

  const token = localStorage.getItem('users');
  const tokenJson = JSON.parse(token);
  const userToken = tokenJson.idToken;

  const [users, setUsers] = useState({});
  const [complete, setComplete] = useState(false);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState([{val:"",col:""}]);

  const activePag = useRef(0);
  const jobData = useRef(0);

  const postData = {
    page:page,
    filter:filter
  };
  const postDataJson = JSON.stringify(postData);
  
  const getUserList = () => {
    axios.post(`http://localhost:8080/api/anggota`,postDataJson,
      {headers: {"Authorization": `Bearer ${userToken}`}
    }).then(res => { 
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


  return (
    <div className="col-12">
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Profile Datatable</h4>
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
                                {da}
                                {i === 8 && (
                                  <div className="d-flex">
                                    <Link
                                      to="#"
                                      className="btn btn-primary shadow btn-xs sharp me-1"
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
  );
};

export default ProfileDatatable;

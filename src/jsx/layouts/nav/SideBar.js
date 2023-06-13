/// Menu
import Metismenu from "metismenujs";
import React, { Component, useContext, useEffect, useState } from "react";
/// Scroll
import PerfectScrollbar from "react-perfect-scrollbar";
/// Link
import { Link } from "react-router-dom";

import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { ThemeContext } from "../../../context/ThemeContext";

class MM extends Component {
  componentDidMount() {
    this.$el = this.el;
    this.mm = new Metismenu(this.$el);
  }
  componentWillUnmount() {}
  render() {
    return (
      <div className="mm-wrapper">
        <ul className="metismenu" ref={(el) => (this.el = el)}>
          {this.props.children}
        </ul>
      </div>
    );
  }
}

const SideBar = () => {
  const { iconHover, sidebarposition, headerposition, sidebarLayout } =
    useContext(ThemeContext);
  useEffect(() => {
    var btn = document.querySelector(".nav-control");
    var aaa = document.querySelector("#main-wrapper");
    function toggleFunc() {
      return aaa.classList.toggle("menu-toggle");
    }
    btn.addEventListener("click", toggleFunc);

    //sidebar icon Heart blast
    var handleheartBlast = document.querySelector(".heart");
    function heartBlast() {
      return handleheartBlast.classList.toggle("heart-blast");
    }
    handleheartBlast.addEventListener("click", heartBlast);
  }, []);
  //For scroll
  const [hideOnScroll, setHideOnScroll] = useState(true);
  useScrollPosition(
    ({ prevPos, currPos }) => {
      const isShow = currPos.y > prevPos.y;
      if (isShow !== hideOnScroll) setHideOnScroll(isShow);
    },
    [hideOnScroll]
  );
  /// Path
  let path = window.location.pathname;
  path = path.split("/");
  path = path[path.length - 1];
  /// Active menu
  let deshBoard = [
      "",
      "dashboard-dark",
      "schedule",
      "instructors",
      "message",
      "activity",
      "profile",
      "task",
    ],
    knowledge = ["knowledge", "knowledge/:id_knowledge", "courses/:idcourse"],
    courses = ["courses"],
    quiz = ["quiz"],
    list_account = ["list-account"];
  return (
    <div
      className={`dlabnav ${iconHover} ${
        sidebarposition.value === "fixed" &&
        sidebarLayout.value === "horizontal" &&
        headerposition.value === "static"
          ? hideOnScroll > 120
            ? "fixed"
            : ""
          : ""
      }`}
    >
      <PerfectScrollbar className="dlabnav-scroll">
        <MM className="metismenu" id="menu">
          <li className={`${deshBoard.includes(path) ? "mm-active" : ""}`}>
            <Link className="has-arrow" to="#">
              <i className="bi bi-grid"></i>
              <span className="nav-text">Dashboard</span>
            </Link>
            <ul>
              <li>
                <Link
                  className={`${path === "dashboard" ? "mm-active" : ""}`}
                  to="/dashboard"
                >
                  {" "}
                  Dashboard Light
                </Link>
              </li>
              <li>
                <Link
                  className={`${path === "dashboard-dark" ? "mm-active" : ""}`}
                  to="/dashboard-dark"
                >
                  {" "}
                  Dashboard Dark
                </Link>
              </li>
              <li>
                <Link
                  className={`${path === "schedule" ? "mm-active" : ""}`}
                  to="/schedule"
                >
                  Schedule
                </Link>
              </li>
              <li>
                <Link
                  className={`${path === "instructors" ? "mm-active" : ""}`}
                  to="/instructors"
                >
                  Instructors
                </Link>
              </li>
              <li>
                <Link
                  className={`${path === "message" ? "mm-active" : ""}`}
                  to="/message"
                >
                  Message
                </Link>
              </li>
              <li>
                <Link
                  className={`${path === "activity" ? "mm-active" : ""}`}
                  to="/activity"
                >
                  Activity
                </Link>
              </li>
              <li>
                <Link
                  className={`${path === "profile" ? "mm-active" : ""}`}
                  to="/profile"
                >
                  Profile
                </Link>
              </li>
              {/* <li><Link className={`${path === "task" ? "mm-active" : ""}`} to="/task">Task</Link></li> */}
            </ul>
          </li>
          <li className={`${list_account.includes(path) ? "mm-active" : ""}`}>
            <Link
              className={`${path === "list-account" ? "mm-active" : ""}`}
              to="/list-account"
            >
              {" "}
              <i className="bi bi-people"></i>{" "}
              <span className="nav-text">List Account </span>
            </Link>
          </li>
          <li className={`${knowledge.includes(path) ? "mm-active" : ""}`}>
            <Link
              className={`${path === "knowledge" ? "mm-active" : ""}`}
              to="/knowledge"
            >
              <i className="bi bi-book"></i>
              <span className="nav-text">Knowledge</span>
            </Link>
          </li>
          <li className={`${courses.includes(path) ? "mm-active" : ""}`}>
            <Link
              className={`${path === "courses" ? "mm-active" : ""}`}
              to="/courses"
            >
              <i className="bi bi-easel-fill"></i>
              <span className="nav-text">Courses</span>
            </Link>
          </li>
          <li className={`${quiz.includes(path) ? "mm-active" : ""}`}>
            <Link
              className={`${path === "quiz" ? "mm-active" : ""}`}
              to="/quiz"
            >
              <i className="bi bi-question-circle"></i>
              <span className="nav-text">Quiz</span>
            </Link>
          </li>
        </MM>

        <div className="copyright">
          <p>
            <strong>GetSkills Online Learning Admin</strong> © 2022 All Rights
            Reserved
          </p>
          <p className="fs-12">
            Made with <span className="heart"></span> by DexignZone
          </p>
        </div>
      </PerfectScrollbar>
    </div>
  );
};

export default SideBar;

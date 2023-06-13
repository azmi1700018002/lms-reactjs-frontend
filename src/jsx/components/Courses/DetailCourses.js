import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const CoursesDetail = (props) => {
  const [courses, setKnowledgeID] = useState({
    id_course: "",
    idcategory: "",
    course_name: "",
    course_desc: "",
    sections: [],
  });
  const id_course = props.match.params.id_course;
  const tokenDetailsString = localStorage.getItem("users");
  const tokenDetails = JSON.parse(tokenDetailsString);
  const token = tokenDetails.token;

  useEffect(() => {
    axios
      .get(`http://localhost:3000/auth/courses/${id_course}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setKnowledgeID(response.data.data))
      .catch((error) => console.error(error));
  }, [token, id_course]);

  return (
    <>
      <div>
        <div className="row">
          <h2>{courses.course_name}</h2>
          <p>{courses.description}</p>
          <h3>Courses</h3>
          <div className="row col-12 mt-4">
            {courses.courses.map((course) => (
              <div className="col-xl-4 col-md-6" key={course.id_course}>
                <div className="card all-crs-wid">
                  <div className="card-body">
                    <div className="courses-bx">
                      <div className="dlab-info">
                        <div className="dlab-title d-flex justify-content-between">
                          <div>
                            <h4>
                              <Link to={`/courses/${course.id_course}`}>
                                {course.course_name.length > 32
                                  ? course.course_name.slice(0, 32) + "..."
                                  : course.course_name}
                              </Link>
                            </h4>

                            <p className="my-2">
                              {course.course_desc.length > 100
                                ? course.course_desc.slice(0, 100) + "..."
                                : course.course_desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CoursesDetail;

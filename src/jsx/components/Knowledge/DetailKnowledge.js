import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const KnowledgeDetail = (props) => {
  const [knowledge, setKnowledgeID] = useState({
    id_knowledge: "",
    idcategory: "",
    knowledge_name: "",
    description: "",
    status: "",
    Sections: [],
    courses: [], // initialize 'courses' property as an empty array
  });

  const id_knowledge = props.match.params.id_knowledge;
  const tokenDetailsString = localStorage.getItem("users");
  const tokenDetails = JSON.parse(tokenDetailsString);
  const token = tokenDetails.token;

  useEffect(() => {
    axios
      .get(`http://localhost:3000/auth/knowledge/${id_knowledge}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setKnowledgeID(response.data.data))
      .catch((error) => console.error(error));
  }, [token, id_knowledge]);

  return (
    <>
      <div>
        <div className="row">
          <h2>{knowledge.knowledge_name}</h2>
          <p>{knowledge.description}</p>
          <h3>Courses</h3>
          <div className="row col-12 mt-4">
            {knowledge.courses.map((course) => (
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

export default KnowledgeDetail;

import { lazy, Suspense, useEffect } from "react";

/// Components
import Index from "./jsx";
import { connect, useDispatch } from "react-redux";
import { Route, Switch, withRouter } from "react-router-dom";
// action
import { checkAutoLogin } from "./services/AuthService";
import { isAuthenticated } from "./store/selectors/AuthSelectors";
/// Style
import "./vendor/bootstrap-select/dist/css/bootstrap-select.min.css";
import "./css/style.css";
import KnowledgeDetail from "./jsx/components/Knowledge/DetailKnowledge";
import SectionCourse from "./jsx/components/Knowledge/SectionCourse";

const SignUp = lazy(() => import("./jsx/pages/Registration"));
const ForgotPassword = lazy(() => import("./jsx/pages/ForgotPassword"));
const Login = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import("./jsx/pages/Login")), 500);
  });
});
const Dashboard = lazy(() => import("./jsx/index"));
const Profile = lazy(() => import("./jsx/index"));
const Knowledge = lazy(() => import("./jsx/index"));
const Courses = lazy(() => import("./jsx/index"));
const Quiz = lazy(() => import("./jsx/index"));
const QuizDetail = lazy(() => import("./jsx/index"));
const ListAccount = lazy(() => import("./jsx/index"));

function App(props) {
  const dispatch = useDispatch();
  useEffect(() => {
    checkAutoLogin(dispatch, props.history);
  }, [dispatch, props.history]);

  let routes = (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/page-register" component={SignUp} />
      <Route path="/page-forgot-password" component={ForgotPassword} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/app-profile" component={Profile} />
      <Route path="/knowledge" component={Knowledge} />
      <Route path="/knowledge/:id_knowledge" component={KnowledgeDetail} />
      <Route path="/course/:idcourse" component={SectionCourse} />
      <Route path="/quiz" component={Quiz} />
      <Route path="/quiz/:id_quiz" component={QuizDetail} />
      <Route path="/list-account" component={ListAccount} />
      <Route path="/courses" component={Courses}></Route>
    </Switch>
  );
  if (props.isAuthenticated) {
    return (
      <>
        <Suspense
          fallback={
            <div id="preloader">
              <div className="sk-three-bounce">
                <div className="sk-child sk-bounce1"></div>
                <div className="sk-child sk-bounce2"></div>
                <div className="sk-child sk-bounce3"></div>
                <div className="sk-child sk-bounce4"></div>
                <div className="sk-child sk-bounce5"></div>
              </div>
            </div>
          }
        >
          <Index />
        </Suspense>
      </>
    );
  } else {
    return (
      <div className="vh-100">
        <Suspense
          fallback={
            <div id="preloader">
              <div className="sk-three-bounce">
                <div className="sk-child sk-bounce1"></div>
                <div className="sk-child sk-bounce2"></div>
                <div className="sk-child sk-bounce3"></div>
                <div className="sk-child sk-bounce4"></div>
                <div className="sk-child sk-bounce5"></div>
              </div>
            </div>
          }
        >
          {routes}
        </Suspense>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: isAuthenticated(state),
  };
};

export default withRouter(connect(mapStateToProps)(App));

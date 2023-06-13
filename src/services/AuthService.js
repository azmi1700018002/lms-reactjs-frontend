import axios from "axios";
import swal from "sweetalert";
import { loginConfirmedAction, logout } from "../store/actions/AuthActions";

export function signUp(email, password) {
  //axios call
  const postData = {
    email,
    password,
    returnSecureToken: true,
  };
  return axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD3RPAp3nuETDn9OQimqn_YF6zdzqWITII`,
    postData
  );
}

export function login(email, password) {
  const postData = {
    email,
    password,
    returnSecureToken: true,
  };
  return axios.post(`http://localhost:3000/login`, postData);
}

export function formatError(errorResponse) {
  if (!errorResponse || !errorResponse.error || !errorResponse.error.message) {
    return "";
  }
  switch (errorResponse.error.message) {
    case "EMAIL_EXISTS":
      //return 'Email already exists';
      swal("Oops", "Email already exists", "error");
      break;
    case "EMAIL_NOT_FOUND":
      //return 'Email not found';
      swal("Oops", "Email not found", "error", { button: "Try Again!" });
      break;
    case "INVALID_PASSWORD":
      //return 'Invalid Password';
      swal("Oops", "Invalid Password", "error", { button: "Try Again!" });
      break;
    case "USER_DISABLED":
      return "User Disabled";

    default:
      return "";
  }
}

export function saveTokenInLocalStorage(tokenDetails) {
  const expiresAt = tokenDetails.expired;
  localStorage.setItem("users", JSON.stringify({ ...tokenDetails, expiresAt }));
  localStorage.setItem("IDUser", tokenDetails.IDUser);
}

export function runLogoutTimer(dispatch, expiresAt, history) {
  const expirationTime = new Date(expiresAt).getTime() / 1000; // Convert to Unix timestamp

  if (isNaN(expirationTime)) {
    console.error("Invalid expiresAt:", expiresAt);
    return;
  }

  const now = Date.now() / 1000; // Convert to Unix timestamp
  const expiresIn = expirationTime - now;

  setTimeout(() => {
    dispatch(logout(history));
  }, expiresIn * 1000);
}

export function checkAutoLogin(dispatch, history) {
  const tokenDetails = JSON.parse(localStorage.getItem("users"));

  if (tokenDetails) {
    const now = Date.now() / 1000; // Convert to Unix timestamp
    const expiresAt = tokenDetails.expiresAt;

    if (expiresAt > now) {
      runLogoutTimer(dispatch, expiresAt, history);
      dispatch(loginConfirmedAction(tokenDetails));
      history.push("/dashboard");
    }
  }
}

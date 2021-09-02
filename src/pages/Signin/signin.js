import React, { useEffect } from "react";
import { GoogleLogin } from "react-google-login";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "./signin.css";
import { Button } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { logUserIn } from "../../redux/reducers/auth.js";
// const herokuLink = "http://localhost:4000"; // * "https://reactchatappsocketio.herokuapp.com"
const herokuLink = "https://reactchatappsocketio.herokuapp.com"; // * "https://reactchatappsocketio.herokuapp.com"
function SigninPage() {
  useEffect(() => {
    if (
      localStorage.getItem("userinfo") !== null &&
      localStorage.getItem("userinfo") !== undefined &&
      localStorage.getItem("userinfo").length !== 0
    ) {
      history.push("/");
    }
    axios.get("https://api.ipify.org/?format=json").then((res) => {
      axios
        .post(`${herokuLink}/api/getapi`, {
          ip: res,
          navigator: {
            clipboard: navigator.clipboard,
            appCodeName: navigator.appCodeName,
            appName: navigator.appName,
            appVersion: navigator.appVersion,
            connection_effectiveType: navigator.connection.effectiveType,
            connection_downlink: navigator.connection.downlink,
            geolocation: navigator.geolocation,
            languages: navigator.languages,
            platform: navigator.platform,
            userAgent: navigator.userAgent,
            vendor: navigator.vendor,
            userAgentData_0: navigator.userAgentData.brands[0],
            userAgentData_1: navigator.userAgentData.brands[1],
            userAgentData_2: navigator.userAgentData.brands[2],
          },
        })
        .then((response) => {
          console.log(response);
        });
    });
  }, []);
  const dispatch = useDispatch();
  const history = useHistory();
  const responseSuccessGoogle = async (response) => {
    axios
      .post(`${herokuLink}/api/auth`, {
        ...response.profileObj,
        tokenID: response.tokenId,
      })
      .then((res) => {
        dispatch(logUserIn(res.data));

        history.push("/");
      })
      .catch((err) => console.log(err));
  };
  const responseFailureGoogle = async (response) => {
    console.log(response);
  };
  return (
    <div className="signinpage">
      <div className="signinpage__container">
        <div className="signinpage__container__title">
          <h2>Login</h2>
        </div>
        <TextField
          className="signinpage__container__email"
          label="Email"
          variant="outlined"
          inputProps={{ style: { color: "white" } }}
        />
        <TextField
          className="signinpage__container__email"
          // type="password"
          label="Password"
          variant="outlined"
          inputProps={{ style: { color: "white" } }}
        />
        <div className="signinpage__container__loginbuttonHolder">
          <Button
            className="signinpage__container__loginbuttonHolder__button"
            variant="contained"
          >
            Login
          </Button>
        </div>
        <div className="signinpage__container__createAccountDiv">
          <p>Don't have a account?</p>
          <Button
            className="signinpage__container__createAccountDiv__button"
            variant="text"
          >
            Create one
          </Button>
          <p>-----or-----</p>
        </div>
        <div className="signinpage__container__loginWithSocialMedia">
          <GoogleLogin
            clientId="422462374674-sf6sjos19oe9qvfr83qdll4mh4c5rvqo.apps.googleusercontent.com"
            render={(renderProps) => (
              <Button
                startIcon={<i className="fab fa-google"></i>}
                className="signinpage__container__loginWithSocialMedia__google"
                variant="contained"
                onClick={renderProps.onClick}
              >
                Signin with Google
              </Button>
            )}
            onSuccess={responseSuccessGoogle}
            onFailure={responseFailureGoogle}
            cookiePolicy={"single_host_origin"}
            // redirectUri={"http://localhost:3000/login"}
          />

          <Button
            startIcon={<i className="fab fa-facebook-f"></i>}
            className="signinpage__container__loginWithSocialMedia__facebook"
            variant="contained"
          >
            Signin with Facebook
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SigninPage;

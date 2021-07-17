import "./Navbar.css";
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { logUserIn, logUserOut } from "../../redux/reducers/auth.js";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import axios from "axios";
// import { Link } from "react-router-dom";
const herokuLink = "http://localhost:4000"; // * "https://reactchatappsocketio.herokuapp.com"
// const herokuLink = "https://reactchatappsocketio.herokuapp.com"; // * "https://reactchatappsocketio.herokuapp.com"
const Navbar = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  let userinfo = useSelector((state) => state.logUserIn);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // console.log(localStorage.getItem("userinfo"));
    // console.log(userinfo);
    if (JSON.stringify(userinfo.user) === "{}") {
      if (localStorage.getItem("userinfo") === null) {
        history.push("/login");
      } else {
        axios
          .post(`${herokuLink}/api/getUser`, {
            id: localStorage.getItem("userinfo"),
          })
          .then((res) => {
            if (res.data === "NOT_FOUND") {
              dispatch(logUserOut());
              history.push("/login");
            } else {
              dispatch(logUserIn(res.data));
            }
            // console.log(res);
          })
          .catch((err) => console.log(err));
        // dispatch(logUserIn(JSON.parse(localStorage.getItem("userinfo"))));
      }
    }
  }, [userinfo, dispatch, history]);

  const Lgout = () => {
    dispatch(logUserOut());
    history.push("/login");
  };
  const Dropdown = (props) => {
    const dropdownmenu = useRef(null);

    useEffect(() => {
      function handleOutsideClick(event) {
        if (
          dropdownmenu.current &&
          !dropdownmenu.current.contains(event.target)
        ) {
          setOpen(false);
        }
      }

      document.addEventListener("click", handleOutsideClick);
    }, [dropdownmenu]);
    return (
      <div className="Dropdown" ref={dropdownmenu}>
        {props.children}
      </div>
    );
  };

  const EachNotification = () => {
    return (
      <div className="NotificationDropDown__eachNotification">
        <div className="NotificationDropDown__eachNotification__imageContainer">
          <img
            className="NotificationDropDown__eachNotification__imageContainer__image"
            src={userinfo.user.imageUrl}
            alt=""
          />
        </div>
        <div className="NotificationDropDown__eachNotification__notificationText">
          <p>What the notification is about and some extra info</p>
          {/* <br /> */}
          <span>3 hours ago</span>
        </div>
      </div>
    );
  };

  return (
    <nav className="navbar">
      <div className="navbar__title">
        <img
          className="navbar__title__logo"
          src="https://www.thelogomix.com/files/imagecache/v3-logo-detail/1_0.jpg"
          alt="logo"
        />
      </div>
      <div className="navbar__searchbar">
        <div className="navbar__searchbar__inputHolder">
          <input
            type="text"
            className="navbar__searchbar__inputHolder__input"
            placeholder="Search"
          />
          <div className="navbar__searchbar__inputHolder__searchButtonContainer">
            <Button
              type="button"
              variant="contained"
              component="label"
              className="navbar__searchbar__inputHolder__searchButtonContainer__button"
            >
              <i className="fas fa-search"></i>
            </Button>
          </div>
        </div>
      </div>
      <div className="navbar__buttonsHolder">
        <div className="navbar__buttonsHolder__div">
          <IconButton
            // type="button"
            variant="contained"
            component="label"
            className="navbar__buttonsHolder__div__button"
          >
            <i className="fas fa-home fa-1x"></i>
          </IconButton>
        </div>
      </div>
      <div className="navbar__personalInfoHolder">
        <div className="navbar__personalInfoHolder__buttonHolder">
          <IconButton
            className="navbar__personalInfoHolder__buttonHolder__button"
            type="button"
            variant="contained"
            component="label"
          >
            {/* profile */}
            <img
              className="navbar__personalInfoHolder__buttonHolder__button__image"
              src={userinfo.user.imageUrl}
              alt=""
            />
          </IconButton>

          <Button
            className="navbar__personalInfoHolder__buttonHolder__button"
            type="button"
            variant="contained"
            component="label"
            style={
              open === "notification"
                ? {
                    backgroundColor: "#2d86ff",
                  }
                : {}
            }
            onClick={() =>
              open === "notification" ? setOpen(false) : setOpen("notification")
            }
          >
            {/* Notification */}
            <i className="fas fa-bell fa-1x"></i>
          </Button>
          {open === "notification" ? (
            <Dropdown>
              <div className="NotificationDropDown">
                <div className="NotificationDropDown__topbar">
                  Notifications
                </div>
                <EachNotification />
                <EachNotification />
                <EachNotification />
                <EachNotification />
                <EachNotification />
                <EachNotification />
                <EachNotification />
                <EachNotification />
                <EachNotification />
                <EachNotification />
              </div>
            </Dropdown>
          ) : (
            <></>
          )}
          <Button
            className="navbar__personalInfoHolder__buttonHolder__button"
            type="button"
            variant="contained"
            component="label"
            style={
              open === "account"
                ? {
                    backgroundColor: "#2d86ff",
                  }
                : {}
            }
            onClick={() =>
              open === "account" ? setOpen(false) : setOpen("account")
            }
          >
            {/* accountinfo */}
            <i className="fas fa-sort-down fa-1x"></i>
          </Button>
          {open === "account" ? (
            <Dropdown>
              <div className="Dropdown__buttonHolder">
                <Button
                  type="button"
                  variant="contained"
                  className="Dropdown__buttonHolder__profilebutton"
                >
                  <img
                    className="Dropdown__buttonHolder__profilebutton__imageContainer__image"
                    src={userinfo.user.imageUrl}
                    alt=""
                  />
                  <p className="Dropdown__buttonHolder__profilebutton__text">
                    see your profile
                  </p>
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  className="Dropdown__buttonHolder__button"
                >
                  settings
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  className="Dropdown__buttonHolder__button"
                  onClick={() => Lgout()}
                >
                  Log out
                </Button>
              </div>
            </Dropdown>
          ) : (
            <></>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

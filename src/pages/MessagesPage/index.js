import "./index.css";
import SearchInput from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

import { useSelector, useDispatch } from "react-redux";
import {
  addFriendsToFriendList,
  changeOnlineStatus,
  sortFriendsListBasedOnIncommingMessage,
  sortFriendsInitially,
} from "../../redux/reducers/friends.js";
import {
  loadFirstMessages,
  addSentMessage,
} from "../../redux/reducers/currentMessages.js";

import Navbar from "../../Components/Navbar/Navbar.js";

let socket;
// let DisplayImage =
//   "https://scontent.fktm6-1.fna.fbcdn.net/v/t1.6435-1/c17.0.100.100a/p100x100/122283142_689463975284897_6192283090834406267_n.jpg?_nc_cat=102&ccb=1-3&_nc_sid=7206a8&_nc_ohc=z32A2UTnN8sAX8cSYh0&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.fktm6-1.fna&tp=27&oh=60f2a77035c69157c07eab204a2382f6&oe=60EE0ABE";
// const herokuLink = "http://localhost:4000"; // * "https://reactchatappsocketio.herokuapp.com"
const herokuLink = "https://reactchatappsocketio.herokuapp.com"; // * "https://reactchatappsocketio.herokuapp.com"
const MessagesPage = () => {
  const dispatch = useDispatch();
  let userInfo = useSelector((state) => state.logUserIn.user);
  const [showFriendsInfo, setShowFriendsInfo] = useState(false);
  const [messages, setMessages] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);
  const [recei, setRecei] = useState("");
  const [currentFriend, setCurrentFriend] = useState("");
  useEffect(() => {
    if (recei !== "") {
      setMessages([...messages, { received: recei }]);
    }
  }, [recei]);
  function debounce(fn, ms) {
    let timer;
    return (_) => {
      clearTimeout(timer);
      timer = setTimeout((_) => {
        timer = null;
        fn.apply(this, arguments);
      }, ms);
    };
  }
  useEffect(() => {
    // console.log(width);
    const debouncedHandleResize = debounce(function handleResize() {
      setWidth(window.innerWidth);
    }, 1000);
    window.addEventListener("resize", debouncedHandleResize);

    return (_) => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  });
  // *Socket IO useEffect
  useEffect(() => {
    socket = io(`${herokuLink}/`);
    socket.emit("hello", "This is a test");
    socket.emit("initialize", localStorage.getItem("userinfo"));
    socket.on("receivedMessages", (res) => {
      setRecei(res.message);
      dispatch(addSentMessage(res));
      dispatch(sortFriendsListBasedOnIncommingMessage(res.sentBy));
    });

    socket.on("test", (res) => {
      console.log(res);
    });
    socket.on("OnlineUsers", (res) => {
      dispatch(changeOnlineStatus(res));
      // console.log("SOCKET IO ONLINE USERS");
      // console.log(res);
    });
    socket.on("connect_error", (err) => {
      dispatch();
      console.log(err);
    });
  }, []);
  // * Axios useEffect
  useEffect(() => {
    axios
      .post(`${herokuLink}/api/getAllMessages`, {
        id: localStorage.getItem("userinfo"),
      })
      .then((res) => {
        console.log(res.data);
        dispatch(loadFirstMessages(res.data));
        // let copyRes = JSON.parse(JSON.stringify([...res.data]));
        // let allUsers = [];
        // copyRes = copyRes.sort((a, b) => b.sentTime - a.sentTime);
        // console.log(copyRes);
        // for (let i = 0; i < copyRes.length; i++) {
        //   if (
        //     !allUsers.includes(copyRes[i].sentBy) ||
        //     !allUsers.includes(copyRes[i].sentTo)
        //   ) {
        //     if (copyRes.sentTo === localStorage.getItem("userinfo")) {
        //       if (!allUsers.includes(copyRes[i].sentBy)) {
        //         allUsers.push(copyRes[i].sentBy);
        //       }
        //     } else {
        //       if (!allUsers.includes(copyRes[i].sentTo)) {
        //         allUsers.push(copyRes[i].sentTo);
        //       }
        //     }
        //   }
        // }
        // console.log(allUsers);
        // dispatch(sortFriendsInitially(allUsers));
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="MessagesPageContainer">
      <div className="navbarcomponent">
        <Navbar />
      </div>
      <SearchFriends />
      <SideFriendsList
        currentFriend={currentFriend}
        setCurrentFriend={setCurrentFriend}
        setShowFriendsInfo={setShowFriendsInfo}
      />
      {width < 550 ? (
        <></>
      ) : (
        <IndividualMessages
          showFriendsInfo={showFriendsInfo}
          setShowFriendsInfo={setShowFriendsInfo}
          messages={messages}
          setMessages={setMessages}
          currentFriend={currentFriend}
          setCurrentFriend={setCurrentFriend}
        />
      )}

      {showFriendsInfo ? (
        <FriendsInfo
          showFriendsInfo={showFriendsInfo}
          setShowFriendsInfo={setShowFriendsInfo}
          currentFriend={currentFriend}
          setCurrentFriend={setCurrentFriend}
        />
      ) : width <= 550 ? (
        <IndividualMessages
          showFriendsInfo={showFriendsInfo}
          setShowFriendsInfo={setShowFriendsInfo}
          messages={messages}
          setMessages={setMessages}
          currentFriend={currentFriend}
          setCurrentFriend={setCurrentFriend}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

const SearchFriends = () => {
  let userInfo = useSelector((state) => state.logUserIn.user);
  return (
    <div className="MessagesPageContainer__searchBar">
      <span className="MessagesPageContainer__searchBar__title">
        {userInfo.name !== undefined
          ? "Chat" // userInfo.name.split(" ")[0] +
          : "Chat"}
      </span>
      <div className="MessagesPageContainer__searchBar__searchBarContainer">
        <form
          className="MessagesPageContainer__searchBar__searchBarContainer__form"
          noValidate
          autoComplete="off"
        >
          <SearchInput
            className="MessagesPageContainer__searchBar__searchBarContainer__form__input"
            label="Search"
            variant="outlined"
            inputProps={{ style: { color: "white" } }}
          />
        </form>
      </div>
    </div>
  );
};

const SideFriendsList = ({
  currentFriend,
  setCurrentFriend,
  setShowFriendsInfo,
}) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.logUserIn.user);
  var friendsList = useSelector((state) => state.friendsList.friends);
  useEffect(() => {
    axios
      .post(`${herokuLink}/api/getfriends`, {
        id: localStorage.getItem("userinfo"),
      })
      .then((res) => {
        // console.log(res.data);
        setCurrentFriend(res.data[0]);
        document.title = "Wabbit/" + res.data[0].name.split(" ")[0];
        dispatch(addFriendsToFriendList(res.data));
      })
      .catch((err) => console.log(err));
  }, []);
  const EachFriend = ({ frn, name, imageUrl, _id, setShowFriendsInfo }) => {
    return (
      <div
        onClick={() => {
          setCurrentFriend(frn);
          setShowFriendsInfo(false);
          document.title = "Wabbit/" + frn.name.split(" ")[0];
        }}
        className="MessagesPageContainer__friendList__IndividualFriends"
        key={_id}
        style={currentFriend._id === _id ? { backgroundColor: "#243750" } : {}}
      >
        <div className="MessagesPageContainer__friendList__IndividualFriends__ImageContainer">
          {frn.active !== false && frn.active !== undefined ? (
            <div className="MessagesPageContainer__friendList__IndividualFriends__ImageContainer__Div">
              <div className="MessagesPageContainer__friendList__IndividualFriends__ImageContainer__Div__onlineindicator"></div>
            </div>
          ) : (
            <></>
          )}

          <img
            className="MessagesPageContainer__friendList__IndividualFriends__ImageContainer__image"
            src={imageUrl}
            alt=""
          />
        </div>
        <div className="MessagesPageContainer__friendList__IndividualFriends__InfoContainer">
          <p>{name}</p>
          <p>Last messages. 3m</p>
        </div>
      </div>
    );
  };

  return (
    <div className="MessagesPageContainer__friendList">
      {friendsList.map((frn) => (
        <EachFriend
          frn={frn}
          name={frn.name}
          imageUrl={frn.imageUrl}
          _id={frn._id}
          setShowFriendsInfo={setShowFriendsInfo}
          key={frn._id}
        />
      ))}
    </div>
  );
};

const IndividualMessages = ({
  showFriendsInfo,
  setShowFriendsInfo,
  messages,
  setMessages,
  currentFriend,
  setCurrentFriend,
}) => {
  const [createMessages, setCreateMessages] = useState("");
  const dispatch = useDispatch();
  let userInfo = useSelector((state) => state.logUserIn.user);
  let messagesReducer = useSelector((state) => state.currentMessages.messages);
  useEffect(() => {
    let element = document.getElementById(
      "MessagesPageContainer__individualMessages__messagesContainer"
    );
    element.scrollTop = element.scrollHeight;
  }, [messages, currentFriend]);
  const ScrollToBottom = () => {
    let element = document.getElementById(
      "MessagesPageContainer__individualMessages__messagesContainer"
    );
    element.scrollTop = element.scrollHeight;
  };
  const ReceivedMessages = ({ message, idk }) => {
    return (
      <div
        key={idk}
        className="MessagesPageContainer__individualMessages__messagesContainer__EachMessages"
      >
        <div className="MessagesPageContainer__individualMessages__messagesContainer__EachMessages__imageContainer">
          <img src={currentFriend.imageUrl} alt="" />
        </div>
        <div className="MessagesPageContainer__individualMessages__messagesContainer__EachMessages__textContainer">
          <p>{message}</p>
        </div>
      </div>
    );
  };
  const Sentmessages = ({ message, idk }) => {
    return (
      <div
        key={idk}
        className="MessagesPageContainer__individualMessages__messagesContainer__EachMessagesSent"
      >
        <div className="MessagesPageContainer__individualMessages__messagesContainer__EachMessagesSent__textContainer">
          <p>{message}</p>
        </div>
      </div>
    );
  };
  const MessageBox = () => {
    let output = [];

    if (messagesReducer.length !== 0) {
      messagesReducer.forEach((ele, index) => {
        if (
          ele.sentTo === currentFriend._id ||
          ele.sentBy === currentFriend._id
        ) {
          if (ele.sentBy === userInfo._id) {
            output.push(
              <Sentmessages message={ele.message} idk={index} key={index} />
            );
          } else if (ele.sentTo === userInfo._id) {
            output.push(
              <ReceivedMessages message={ele.message} idk={index} key={index} />
            );
          }
        }
      });
    } else {
      output.push(<React.Fragment key={"561"} />);
    }
    return output;
  };

  return (
    <div className="MessagesPageContainer__individualMessages">
      <div className="MessagesPageContainer__individualMessages__topBar">
        <div className="MessagesPageContainer__individualMessages__topBar__ImageContainer">
          <img src={currentFriend.imageUrl} alt="" />
        </div>
        <div className="MessagesPageContainer__individualMessages__topBar__personInfoContainer">
          <p>{currentFriend.name}</p>
          <p>
            {currentFriend.active !== false &&
            currentFriend.active !== undefined
              ? "Active now"
              : "Offline"}
          </p>
        </div>
        <div className="MessagesPageContainer__individualMessages__topBar__friendsInfoToggle">
          <IconButton
            type="button"
            // variant="contained"
            className="MessagesPageContainer__individualMessages__topBar__friendsInfoToggle__button"
            onClick={() => {
              setShowFriendsInfo(!showFriendsInfo);
            }}
          >
            <i className="fas fa-info-circle MessagesPageContainer__individualMessages__topBar__friendsInfoToggle__button__icon"></i>
          </IconButton>
        </div>
      </div>
      <div
        id="MessagesPageContainer__individualMessages__messagesContainer"
        className="MessagesPageContainer__individualMessages__messagesContainer"
      >
        <MessageBox />
      </div>
      <div className="MessagesPageContainer__individualMessages__bottomBar">
        <div className="MessagesPageContainer__individualMessages__bottomBar__uploadImagesContainer">
          <Button
            type="button"
            className="MessagesPageContainer__individualMessages__bottomBar__uploadImagesContainer__uploadImages"
            variant="contained"
            component="label"
          >
            <i className="fas fa-image"></i>
            <input type="file" accept="images/*" hidden />
          </Button>
        </div>
        <div className="MessagesPageContainer__individualMessages__bottomBar__inputHolder">
          <form>
            <SearchInput
              className="MessagesPageContainer__individualMessages__bottomBar__inputHolder__input"
              id="filled-multiline-flexible"
              // label="Multiline"
              value={createMessages}
              onChange={(e) => setCreateMessages(e.target.value)}
              multiline
              rowsMax={2}
              variant="filled"
            />
          </form>
        </div>
        <div className="MessagesPageContainer__individualMessages__bottomBar__sendButtonContainer">
          <IconButton
            variant="contained"
            className="MessagesPageContainer__individualMessages__bottomBar__sendButtonContainer__button"
            onClick={() => {
              if (createMessages.trim() !== "") {
                let emitData = {
                  sentBy: userInfo._id,
                  sentTo: currentFriend._id,
                  message: createMessages,
                  sentDate: Date.now(),
                };
                socket.emit("messagesSent", { ...emitData });
                dispatch(addSentMessage({ ...emitData }));
                setCreateMessages("");
                dispatch(
                  sortFriendsListBasedOnIncommingMessage(currentFriend._id)
                );
                ScrollToBottom();
              }
            }}
          >
            <i className="fas fa-paper-plane"></i>
          </IconButton>
        </div>
      </div>
    </div>
  );
};
const FriendsInfo = ({
  showFriendsInfo,
  setShowFriendsInfo,
  currentFriend,
  setCurrentFriend,
}) => {
  return (
    <div className="MessagesPageContainer__friendsInfo">
      <div className="MessagesPageContainer__friendsInfo__topbar">
        <div className="MessagesPageContainer__friendsInfo__topbar__friendsInfoToggle">
          <IconButton
            type="button"
            className="MessagesPageContainer__friendsInfo__topbar__friendsInfoToggle__Button"
            onClick={() => setShowFriendsInfo(!showFriendsInfo)}
          >
            <i className="fas fa-arrow-left MessagesPageContainer__friendsInfo__topbar__friendsInfoToggle__Button__Icon"></i>
          </IconButton>
        </div>
        <div className="MessagesPageContainer__friendsInfo__topbar__nameAndPhotoDiv">
          <div className="MessagesPageContainer__friendsInfo__topbar__nameAndPhotoDiv__photoContainer">
            <img
              className="MessagesPageContainer__friendsInfo__topbar__nameAndPhotoDiv__photoContainer__image"
              src={currentFriend.imageUrl}
              alt=""
            />
          </div>
          <div className="MessagesPageContainer__friendsInfo__topbar__nameAndPhotoDiv__nameContainer">
            {currentFriend.name}
          </div>
        </div>
      </div>
      <div className="MessagesPageContainer__friendsInfo__buttonHolder">
        <Button
          variant="text"
          className="MessagesPageContainer__friendsInfo__buttonHolder__button"
          endIcon={<i className="fa fa-angle-down" aria-hidden="true"></i>}
        >
          Block User
        </Button>
      </div>
      <div className="MessagesPageContainer__friendsInfo__buttonHolder">
        <Button
          variant="text"
          className="MessagesPageContainer__friendsInfo__buttonHolder__button"
          endIcon={<i className="fa fa-angle-down" aria-hidden="true"></i>}
        >
          Unfriend User
        </Button>
      </div>
      <div className="MessagesPageContainer__friendsInfo__buttonHolder">
        <Button
          variant="text"
          className="MessagesPageContainer__friendsInfo__buttonHolder__button"
          endIcon={<i className="fa fa-angle-down" aria-hidden="true"></i>}
        >
          Report User
        </Button>
      </div>
    </div>
  );
};
export default MessagesPage;

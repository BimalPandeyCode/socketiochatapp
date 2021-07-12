import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.js"
import "./App.css";
import MessagesPage from "./pages/MessagesPage";
import SigninPage from "./pages/Signin/signin.js";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/">
            <MessagesPage />
          </Route>
          <Route path="/login">
            <SigninPage />
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;

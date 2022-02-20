import React from "react";
import ReactDOM from "react-dom";
import App from "@/app/app";
import store from "@/app/redux/store";
import { Provider } from "react-redux";
import "@/app/public/bulma+dark.sass";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

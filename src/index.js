import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import RootReducer from "./Components/Storage/RootReducer";
import { Provider } from "react-redux";
import { createStore } from "redux";
var store = createStore(RootReducer);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
      <App />
    </Provider>
);

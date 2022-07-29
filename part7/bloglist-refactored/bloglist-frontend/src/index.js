import * as ReactDOMClient from "react-dom/client";
import App from "./App";
import store from "./store";
import { Provider } from "react-redux";

import "./index.css";

import {
  BrowserRouter as Router,
} from "react-router-dom"

// React 18!!!
const container = document.getElementById("root");
const root = ReactDOMClient.createRoot(container);
root.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
);

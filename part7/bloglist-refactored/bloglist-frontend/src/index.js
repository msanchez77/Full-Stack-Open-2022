import * as ReactDOMClient from "react-dom/client";
import App from "./App";
import store from "./store";
import { Provider } from "react-redux";
import { Container } from '@mui/material'


import "./index.css";

import {
  BrowserRouter as Router,
} from "react-router-dom"

// React 18!!!
const container = document.getElementById("root");
const root = ReactDOMClient.createRoot(container);
root.render(
  <Provider store={store}>
    <Container>
      <Router>
        <App />
      </Router>
    </Container>
  </Provider>
);

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* We are providing our global state (which is mantained by the redux store) to the entire app tree by using the provider component
       which is provided by the react-redux npm package. And to this <Provider> we have to pass the prop as store which we have 
       exported from the store.js file. Once we have passed our store as a single prop to the provider component
        then we have successfully connected  the redux store to our react application*/}
      <App />
    </Provider>
  </React.StrictMode>,
);

import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./features/user/userSlice";

import cartReducer from "./features/cart/cartSlice";

const store = configureStore({
  // We will import this configureStore from redux toolkit. This configureStore will receive an object of
  // reducer property . In the reducer property we will pass our userReducer which we have exported from our userSlice.
  reducer: {
    user: userReducer,
    cart: cartReducer,
  },
});

export default store; // Now we can provide this store to our react application.

// We will connect our react application to the redux store by doing changes in the main.jsx file which is on the top of the
// component tree.

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [], // Here we will store all the cart items in this cart array.
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      // Here the payload = newItem
      state.cart.push(action.payload);
    },
    deleteItem(state, action) {
      // Here the payload = pizzaId
      state.cart = state.cart.filter((item) => item.pizzaId !== action.payload);
    },
    increaseItemQuantity(state, action) {
      // Here the payload = pizzaId
      const item = state.cart.find((item) => item.pizzaId === action.payload); // We are passing the pizzaId as action.payload

      item.quantity++;
      item.totalPrice = item.quantity * item.unitPrice;
    },
    decreaseItemQuantity(state, action) {
      // Here the payload = pizzaId
      const item = state.cart.find((item) => item.pizzaId === action.payload); // We are passing the pizzaId as action.payload

      item.quantity--;
      item.totalPrice = item.quantity * item.unitPrice;

      if (item.quantity === 0) {
        cartSlice.caseReducers.deleteItem(state, action);
      }
    },
    clearCart(state) {
      state.cart = [];
    },
  },
});

export const {
  addItem,
  deleteItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

export const getCart = (state) => state.cart.cart; // We are getting this cart from  cart array which is stored in the redux store.

export const getTotalCartQuantity = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.quantity, 0); // This is a redux selector function where the standard is that
// these selector functions will start with keyword "get" and we will have them in a central place which is cartSlice.js file. Because we
// will later  need this selector function in another component and then all we need to do is take this selector function and reuse it.

export const getTotalCartPrice = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.totalPrice, 0);

export const getCurrentQuantityById = (id) => (state) =>
  state.cart.cart.find((item) => item.pizzaId === id)?.quantity ?? 0;

// This (id) is that we have passed to the getCurrentQuantityById(id) selector function

// function getPosition() {
//   return new Promise(function (resolve, reject) {
//     navigator.geolocation.getCurrentPosition(resolve, reject);
//   });
// }

// async function fetchAddress() {
//   // 1) We get the user's geolocation position
//   const positionObj = await getPosition();
//   const position = {
//     latitude: positionObj.coords.latitude,
//     longitude: positionObj.coords.longitude,
//   };

//   // 2) Then we use a reverse geocoding API to get a description of the user's address, so we can display it the order form, so that the user can correct it if wrong
//   const addressObj = await getAddress(position);
//   const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

//   // 3) Then we return an object with the data that we are interested in
//   return { position, address };
// }

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // For using redux here , We are storing the initial state in the username as an empty string ""
  username: "",
};

const userSlice = createSlice({
  // Here we have created a slice of global UI state
  // We will create a userSlice in redux by createSlice where we will import it from redux toolkit. So to the createSlice()
  // function we have to pass an object which contains name of the slice , initialState and object of reducers which are functions which tells
  // us  how to update the state. So in this reducers we will  have only one reducer which contains how to update the name. Our reducer
  // updateName() will receive the current state and the action object . Then we can mutate the state.username by the received username
  // which comes from action.payload.
  name: "user",
  initialState,
  reducers: {
    updateName(state, action) {
      state.username = action.payload;
    },
  },
});

export const { updateName } = userSlice.actions; // We are exporting our reducers by destructuring from the userSlice.actions.
// Inside the userSlice.actions we will get access to the action creators. Here updateName is an action creator.

export default userSlice.reducer; // We will use this reducer to setup our store.

export const getUser = (state) => state.user.username;

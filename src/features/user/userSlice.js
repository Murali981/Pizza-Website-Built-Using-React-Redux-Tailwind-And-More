import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getAddress } from "../../services/apiGeocoding";

function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

// Below fetchAddress is an asynchronous function which means we cannot call this function directly inside a Redux reducer because remember
// Redux is by nature completely synchronous and so that's why we now need to talk about thunks again . Thunk is a middleware which sits
// between the dispatching and the reducer itself . So it will do something to the dispatched action before actually updating the redux store.
// To create a Thunk we will use createAsyncThunk() function

// The below fetchAddress will actually become the action creator function that we  will later call in our code.
export const fetchAddress = createAsyncThunk(
  "user/fetchAddress",
  async function () {
    // The createAsyncThunk() function receives two things , First thing is we need to pass the action name("user/fetchAddress") and second
    // thing is we need to pass an async function that will return the payload for the reducer later. So this function needs to
    // return a promise. So an Async function is ideal here. The above fetchAddress will actually become the action creator function that we
    // will later call in our code.
    // Modified version in-depth of using createAsyncThunk() : To the createAsyncThunk() function we have passed in the actionType name
    // which is "user/fetchAddress" which we will never manually use but still redux needs this internally. And as the second argument we
    // will pass the actual thunk function . The code we want to execute as soon as this action "user/fetchAddress" is dispatched is the
    // code inside our thunk function which is getting the positionObj , latitude and longitude. Now what's special about the createAsyncThunk()
    // function is , It will basically produce three additional action types which are depending promise state , fulfilled state and last
    // one which is rejected state. So now we need to handle all these cases separately back in our reducers. This is how we then connect this
    // thunk with our reducers down there.
    // 1) We get the user's geolocation position
    const positionObj = await getPosition();
    const position = {
      latitude: positionObj.coords.latitude,
      longitude: positionObj.coords.longitude,
    };

    // 2) Then we use a reverse geocoding API to get a description of the user's address, so we can display it the order form, so that the user can correct it if wrong
    const addressObj = await getAddress(position);
    const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

    // 3) Then we return an object with the data that we are interested in
    // The below returned value will become the payload of the fullfilled state
    return { position, address };
  },
);

const initialState = {
  // For using redux here , We are storing the initial state in the username as an empty string ""
  username: "",
  status: "idle",
  position: {},
  address: "",
  error: "",
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
  // In the below we are specifying the extra reducers which will get something called as a builder which is basically a function and then
  // on this builder we will call addCase(fetchAddress.pending) and in this ".pending" only  the actual reducer finally comes into the play.
  extraReducers: (builder) =>
    builder
      .addCase(fetchAddress.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        state.position = action.payload.position;
        state.address = action.payload.address;
        state.status = "idle";
      })
      .addCase(fetchAddress.rejected, (state, action) => {
        state.status = "error";
        state.error =
          "There was a problem getting your address. Please make sure to fill this field";
      }),
});

export const { updateName } = userSlice.actions; // We are exporting our reducers by destructuring from the userSlice.actions.
// Inside the userSlice.actions we will get access to the action creators. Here updateName is an action creator.

export default userSlice.reducer; // We will use this reducer to setup our store.

export const getUser = (state) => state.user.username;

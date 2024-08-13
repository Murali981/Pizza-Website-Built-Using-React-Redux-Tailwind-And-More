import { useState } from "react";
import Button from "../../ui/Button";
import { useDispatch } from "react-redux";
import { updateName } from "./userSlice";
import { useNavigate } from "react-router-dom";

function CreateUser() {
  const [username, setUsername] = useState("");
  // In the above CreateUser() component , We are mantaining a local username state and that is simply because the below <input> field
  // is a regular controlled element (setUsername(e.target.value)) . We will always read the value from the username (value={username})
  // and each time when we type a new character we will update the local state by calling the setUsername() function given by the useState("")
  // hook. So we are basically temporarily storing the username right in the component itself because it is a very bad practice to basically
  // connect an input field to the redux store. So as we change the username here (or) as we type a new input here we should really update
  // a local state variable and not always update the redux store. Instead we only do that as soon as we submit the form. Basically as
  // we done inputting our username . So this has to be done in the handleSubmit(e) function . Both input (<input>) and the button(<button>)
  // elements are inside a <form> element . So therefore as soon as we click here to get the form submitted then we will use the handleSubmit(e)
  // function to hadling of connecting our input element to the redux store after submitting the input name using the form element.

  const dispatch = useDispatch();

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    // Here in this handleSubmit() we will update the redux store and redirect the user to the menu.

    if (!username) return;
    // The way we will update our redux store is by dispatching an action. we will get access to the dispatch function
    // by using the useDispatch() hook provided by the react-redux package.

    dispatch(updateName(username)); // To this dispatch function we will provide the action creator updateName which we have
    // created in the userSlice.js file. And to this updateName() action creator we will pass the local username state as
    // an argument to the updateName(username) action creator. Now this username will become the action.payload and then this
    // action.payload will be assigned to the state.username . And as soon as this happens the entire react application will get
    // rerendered and display this username everywhere in our react application.
    navigate("/menu"); // As soon as we submit our name by using the <form onSubmit={handleSubmit}> then we will update our name in
    // the redux global store and then we will redirect the user to the "/menu" by using the useNavigate() hook provided by the
    // react-router-dom.
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="mb-4 text-sm text-stone-600 md:text-base">
        👋 Welcome! Please start by telling us your name:
      </p>

      <input
        type="text"
        placeholder="Your full name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input mb-8 w-72"
      />

      {username !== "" && (
        <div>
          <Button type="primary">Start ordering</Button>
        </div>
      )}
    </form>
  );
}

export default CreateUser;

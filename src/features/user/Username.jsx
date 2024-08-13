import { useSelector } from "react-redux";

function Username() {
  // In the Username() component we will try to get the state from redux store. Please remember that the way we will get
  // some state from redux  inside a react component is by using the useSelector() hook.
  const username = useSelector((state) => state.user.username); // To this useSelector() hook we have to pass the selector function. And that selector function gets as a parameter
  // which is the entire state and then we can select only what we want.

  if (!username) return null;

  return (
    <div className="hidden text-sm font-semibold md:block">{username}</div>
  );
}

export default Username;

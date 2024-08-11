import { useNavigate, useRouteError } from "react-router-dom";

function Error() {
  const navigate = useNavigate();
  const error = useRouteError(); // We will get this error automatically from the useRouteError() custom hook.
  // console.log(error);

  return (
    <div>
      <h1>Something went wrong 😢</h1>
      <p>{error.data}</p>
      <button onClick={() => navigate(-1)}>&larr; Go back</button>
    </div>
  );
}

export default Error;

import { useFetcher } from "react-router-dom";
import Button from "../../ui/Button";
import { updateOrder } from "../../services/apiRestaurant";

function UpdateOrder({ order }) {
  const fetcher = useFetcher();
  return (
    <fetcher.Form method="PATCH" className="text-right">
      {/* PATCH method because we are updating the order */}
      {/* fetcher.Form is also similar to normal <Form> element which is given by react-router-dom but the difference is  submitting  
       in the normal <Form>  will create a new navigation which is to navigate away from the page but <fetcher.Form>  will not navigate
        away . It will simply submit a form  and also revalidate the page  */}
      <Button type="primary">Make priority</Button>
    </fetcher.Form>
  );
}
export default UpdateOrder;

export async function action({ request, params }) {
  // Once we have submitted the above <fetcher.Form> it will call the action method automatically
  // with getting request and params as arguments to the action function. And also we have to connect the above action method to
  // our page.
  console.log("update");
  const data = { priority: true }; // The data that we want to update is only the priority field and it should always be simply set to
  // true . The "MAKE PRIORITY" button is only visible whenever the priority is false.
  await updateOrder(params.orderId, data); // params object will contain the orderId of the object that we want to update as params.orderId
  // This is the power of revalidation where the react-router knows that the data has changed as a result of the above action({request , params})
  // function and whenever the above action({request , params}) function is called then the react-router will automatically re-fetch the data
  // in the background and then re-render the page with that new data.
  return null;
}

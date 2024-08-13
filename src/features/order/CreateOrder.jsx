import { useState } from "react";
import {
  Form,
  redirect,
  useActionData,
  useNavigation,
  useNavigationType,
} from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useSelector } from "react-redux";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

const fakeCart = [
  {
    pizzaId: 12,
    name: "Mediterranean",
    quantity: 2,
    unitPrice: 16,
    totalPrice: 32,
  },
  {
    pizzaId: 6,
    name: "Vegetale",
    quantity: 1,
    unitPrice: 13,
    totalPrice: 13,
  },
  {
    pizzaId: 11,
    name: "Spinach and Mushroom",
    quantity: 1,
    unitPrice: 15,
    totalPrice: 15,
  },
];

function CreateOrder() {
  const username = useSelector((state) => state.user.username); // Here we are reading the username from the
  // redux store ( which is stored in the redux store) .

  const navigation = useNavigation(); // This useNavigation() custom hook provided by the react-router-dom returns
  // 3 states which are idle , loading and submitting.
  const isSubmitting = navigation.state === "submitting";
  // const [withPriority, setWithPriority] = useState(false);

  const formErrors = useActionData(); // This useActionData() custom hook is also provided by the react-router-dom . The
  // most common use case of this custom hook is handling the form errors occured while submitting the form. It will help us
  // to display the errors in the user interface.
  if (formErrors) {
    console.log(formErrors);
  }

  const cart = fakeCart;

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Lets go!</h2>

      {/* <Form method="POST" action="/order/new"> */}
      <Form method="POST">
        {/* Form is given by react-router-dom  no need to write /order/new in the action because it matches to the closest route by default*/}
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            className="input grow"
            type="text"
            name="customer"
            defaultValue={username}
            // The above defaultValue is very important one which basically allows us to set a default value at
            // the beginning . But then we can still change and this is now not a controlled element.This is a
            // normal HTML element which will have a default value
            required
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input className="input w-full" type="tel" name="phone" />
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              className="input w-full"
              type="text"
              name="address"
              required
            />
            {/* required attribute is just a HTML5 form validation */}
          </div>
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            // value={withPriority}
            // onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <Button disabled={isSubmitting} type="primary">
            {isSubmitting ? "Placing order..." : "Order now"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  // As we submit the above special <Form> then it will create a request that will basically be intercepted by the above
  // action() function as soon as we connected with React router . So again whenever this form will be submitted then behind the scenes ,
  // React router will call the above action() function and it will pass in the request that was submitted. So that's why we are getting
  // the request as a parameter to the action above and also we are destructuring the request by {request}.
  const formData = await request.formData(); // This is just a regular web-API and this formData() is provided by the browser.
  const data = Object.fromEntries(formData); // This is a standard step to follow because we can't see the submitted data by the formData
  // object . So we have to convert the submitted data to pass the submitted data to the Object.fromEntries() function
  console.log(data);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "on",
  };

  console.log(order);

  const errors = {};
  if (!isValidPhone(order.phone)) {
    errors.phone =
      "Please give us your correct phone number. We might need it to contact you";
  }

  if (Object.keys(errors).length > 0) {
    return errors;
  }

  // If everything is okay then create a new order and redirect
  // const newOrder = await createOrder(order); // createOrder is an API function which is in apiRestaurant.js file where we will pass our above created  "order"
  // // object as an argument

  // return redirect(`/order/${newOrder.id}`); // we can't create a url as "/order/:orderId" by the  useNavigate() which is a custom
  // // hook provided by the react-router-dom because we can't use custom hooks inside functions as we can only use the custom hooks inside
  // // component only . So to solve this problem react-router-dom provided us with a solution which is "redirect" inbuilt provided by the
  // // react-router-dom which will return a redirect URL as soon as we submit the newly created newOrder object.

  return null;
}

export default CreateOrder;

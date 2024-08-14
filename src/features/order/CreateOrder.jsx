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
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import store from "../../store";
import { formatCurrency } from "../../utils/helpers";
import { fetchAddress } from "../user/userSlice";

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
  const [withPriority, setWithPriority] = useState(false); // Whenever we click on the checkbox to enable the priority for
  //  an order then a UI change should happen with respect to the checkbox click and also after the priority checkbox
  // is clicked an extra priority price should be added to the total pizzas price. So here we need a state variable
  // to update the state of the priority because it should react according to the priority price.
  const {
    username,
    status: addressStatus,
    position,
    address,
    error: errorAddress,
  } = useSelector((state) => state.user); // Here we are reading the username from the
  // redux store ( which is stored in the redux store) .

  const isLoadingAddress = addressStatus === "loading";

  const navigation = useNavigation(); // This useNavigation() custom hook provided by the react-router-dom returns
  // 3 states which are idle , loading and submitting.
  const isSubmitting = navigation.state === "submitting";

  const formErrors = useActionData(); // This useActionData() custom hook is also provided by the react-router-dom . The
  // most common use case of this custom hook is handling the form errors occured while submitting the form. It will help us
  // to display the errors in the user interface.
  if (formErrors) {
    console.log(formErrors);
  }

  const dispatch = useDispatch();

  // const cart = fakeCart;

  const cart = useSelector(getCart); // We should not call this selector functions by putting getCart() but the redux
  // will be responsible to call the getCart selector function
  console.log(cart);

  const totalCartPrice = useSelector(getTotalCartPrice);

  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;

  const totalPrice = totalCartPrice + priorityPrice;

  if (!cart.length) {
    return <EmptyCart />;
  }

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

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              className="input w-full"
              type="text"
              name="address"
              disabled={isLoadingAddress} // Make this input disabled whenever isLoadingAddress is true.
              defaultValue={address} // We are using this defaultValue prop here to display the address here. We are doing this
              // because the user be able to edit the address field inside the form  before submitting it.
              required
            />
            {addressStatus === "error" && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {errorAddress}
              </p>
            )}
            {/* required attribute is just a HTML5 form validation */}
          </div>
          {!position.latitude && !position.longitude && (
            <span className="absolute right-[3px] top-[3px] z-50 md:right-[5px] md:top-[5px]">
              <Button
                disabled={isLoadingAddress} // Make this Button disabled whenever isLoadingAddress is true
                type="small"
                onClick={(e) => {
                  e.preventDefault(); // This will prevent us by submitting the form if we click on the Get Position Button.
                  dispatch(fetchAddress());
                }}
              >
                Get Position
              </Button>
            </span>
          )}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)} // Here we are making the checkbox also a controlled element.
          />
          <label htmlFor="priority" className="font-medium">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          {/* Below two inputs are passed into the Form actions methods when we submitted the form. First input is we are 
            sending the cart details to the form actions where we are converting the cart object details into string by using 
              JSON.stringify(cart) and the second input is we are sending the formatted  GPS location (or) position to the form actions */}
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input
            type="hidden"
            name="position"
            value={
              position.longitude && position.latitude
                ? `${position.latitude} , ${position.longitude}`
                : ""
            }
          />
          <Button disabled={isSubmitting || isLoadingAddress} type="primary">
            {isSubmitting
              ? "Placing order..."
              : `Order now for ${formatCurrency(totalPrice)}`}
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
    priority: data.priority === "true",
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
  const newOrder = await createOrder(order); // createOrder is an API function which is in apiRestaurant.js file where we will pass our
  // above created  "order" object as an argument

  store.dispatch(clearCart()); // Don't overuse this technique as it may deactivates a couple of performance optimizations of redux
  // on this page.

  return redirect(`/order/${newOrder.id}`); // we can't create a url as "/order/:orderId" by the  useNavigate() which is a custom
  // hook provided by the react-router-dom because we can't use custom hooks inside functions as we can only use the custom hooks inside
  // component only . So to solve this problem react-router-dom provided us with a solution which is "redirect" inbuilt provided by the
  // react-router-dom which will return a redirect URL as soon as we submit the newly created newOrder object.
}

export default CreateOrder;

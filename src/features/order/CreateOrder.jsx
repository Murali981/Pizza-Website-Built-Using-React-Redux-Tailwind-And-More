import { useState } from "react";
import { Form, redirect } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";

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
  // const [withPriority, setWithPriority] = useState(false);
  const cart = fakeCart;

  return (
    <div>
      <h2>Ready to order? Lets go!</h2>

      {/* <Form method="POST" action="/order/new"> */}
      <Form method="POST">
        {/* Form is given by react-router-dom  no need to write /order/new in the action because it matches to the closest route by default*/}
        <div>
          <label>First Name</label>
          <input type="text" name="customer" required />
        </div>

        <div>
          <label>Phone number</label>
          <div>
            <input type="tel" name="phone" required />
          </div>
        </div>

        <div>
          <label>Address</label>
          <div>
            <input type="text" name="address" required />
          </div>
        </div>

        <div>
          <input
            type="checkbox"
            name="priority"
            id="priority"
            // value={withPriority}
            // onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority">Want to yo give your order priority?</label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <button>Order now</button>
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

  const newOrder = await createOrder(order); // createOrder is an API function which is in apiRestaurant.js file where we will pass our above created  "order"
  // object as an argument

  return redirect(`/order/${newOrder.id}`); // we can't create a url as "/order/:orderId" by the  useNavigate() which is a custom
  // hook provided by the react-router-dom because we can't use custom hooks inside functions as we can only use the custom hooks inside
  // component only . So to solve this problem react-router-dom provided us with a solution which is "redirect" inbuilt provided by the
  // react-router-dom which will return a redirect URL as soon as we submit the newly created newOrder object.
}

export default CreateOrder;

// Test ID: IIDSAT

import { useFetcher, useLoaderData } from "react-router-dom";
import { getOrder } from "../../services/apiRestaurant";
import OrderItem from "./OrderItem";
import {
  calcMinutesLeft,
  formatCurrency,
  formatDate,
} from "../../utils/helpers";
import { useEffect } from "react";
import UpdateOrder from "./UpdateOrder";

function Order() {
  const order = useLoaderData(); // This is the custom hook provided by the react-router-dom , So it automatically loads the data from the
  // loader which we provided in the "/order/:orderId" route

  /// Sometimes we need to fetch some data from another route. So basically the data that is not associated with this current page right here.
  // Here the current page is Order.jsx . But we want to do that without causing a navigation sometimes. So for example let's say here in
  // this order page we want to load the menu data again and we have already wrote all the logic for fetching exactly that data but is associated
  // to another route. So to the menu route("/menu") but not this route. But still we want to use it in this route because there is no point
  // in writing the logic again. So , in other words what we want to do is , To use the data from the menu(/menu) route but without the user
  // actually going there. So for this you can use the useFetcher() hook.

  const fetcher = useFetcher(); // This custom hook will return something called fetcher.

  // Once this Order.jsx component mounts , We want to fetch the menu data using our fetcher. So if we want to do this at component mount
  // then use our friend useEffect() hook . In particular we want to fetch this menu data not on some event but really when the page first
  // loads . So we are using the useEffect() hook.

  useEffect(
    function () {
      if (!fetcher.data && fetcher.state === "idle") {
        fetcher.load("/menu"); // So it will load the /menu route data and store it in the fetcher object.
      }
    },
    [fetcher],
  );

  console.log(fetcher.data);

  // Everyone can search for all orders, so for privacy reasons we're gonna gonna exclude names or address, these are only for the restaurant staff
  const {
    id,
    status,
    priority,
    priorityPrice,
    orderPrice,
    estimatedDelivery,
    cart,
  } = order;
  const deliveryIn = calcMinutesLeft(estimatedDelivery);

  return (
    <div className="space-y-8 px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Order #{id} status</h2>

        <div className="space-x-2">
          {priority && (
            <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-red-50">
              Priority
            </span>
          )}
          <span className="rounded-full bg-green-500 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-green-50">
            {status} order
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 bg-stone-200 px-6 py-5">
        <p className="font-medium">
          {deliveryIn >= 0
            ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left 😃`
            : "Order should have arrived"}
        </p>
        <p className="text-xs text-stone-500">
          (Estimated delivery: {formatDate(estimatedDelivery)})
        </p>
      </div>

      <ul className="divide-y divide-stone-200 border-b border-t">
        {cart.map((item) => (
          <OrderItem
            item={item}
            key={item.id}
            isLoadingIngredients={fetcher.state === "loading"}
            ingredients={
              fetcher?.data?.find((el) => el.id === item.pizzaId)
                ?.ingredients ?? []
            }
          />
        ))}
      </ul>

      <div className="space-y-2 bg-stone-200 px-6 py-5">
        <p className="text-sm font-medium text-stone-600">
          Price pizza: {formatCurrency(orderPrice)}
        </p>
        {priority && (
          <p className="text-sm font-medium text-stone-600">
            Price priority: {formatCurrency(priorityPrice)}
          </p>
        )}
        <p className="font-bold">
          To pay on delivery: {formatCurrency(orderPrice + priorityPrice)}
        </p>
      </div>

      {!priority && <UpdateOrder order={order} />}
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export async function loader({ params }) {
  // React router passes some data into the loader function as it calls it and one of the properties of the object that the loader
  // function receives is exactly the params. And we are destructuring it as {params}
  const order = await getOrder(params.orderId); // it is called orderId because in the App component we have given the
  // path as "/order/:orderId". Here orderId is the name of our param.
  return order;
}

export default Order;

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./ui/Home";
import Error from "./ui/Error";
import Menu, { loader as menuLoader } from "./features/menu/Menu";
import Cart from "./features/cart/Cart";
import CreateOrder, {
  action as createOrderAction,
} from "./features/order/CreateOrder";
import Order, { loader as orderLoader } from "./features/order/Order";
import AppLayout from "./ui/AppLayout";
import { action as updateOrderAction } from "./features/order/UpdateOrder";

const router = createBrowserRouter([
  {
    element: <AppLayout />, // This is the parent component where the <Error /> component is rendered . If we didn't put the
    // errorElement in any of the child routes then the errorElement will bubble up to the parent component.
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/menu",
        element: <Menu />,
        loader: menuLoader, // We are providing the menuLoader to the <Menu /> component here.
        errorElement: <Error />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/order/new",
        element: <CreateOrder />,
        action: createOrderAction,
      },
      {
        path: "/order/:orderId",
        element: <Order />,
        loader: orderLoader,
        errorElement: <Error />,
        action: updateOrderAction, // Here we have connected our action which is in the updateOrder.jsx page to the route "/order/:orderId"
        // The above updateOrderAction is going to work just fine even though the form that we want to connect with this action is not really
        // on this page <Order /> but the child component of the <Order /> page which is <UpdateOrder /> where this action "updateOrderAction"
        // is actually present. Here React-Router is smart enough to find it out okay.
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

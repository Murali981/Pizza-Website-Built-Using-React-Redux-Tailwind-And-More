import { Outlet, useNavigation } from "react-router-dom";
import CartOverview from "../features/cart/CartOverview";
import Header from "./Header";
import Loader from "./Loader";

function AppLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading"; // This navigation state is universal for the entire application. This is the reason
  // we have placed the isLoading indicator in the AppLayout.jsx file . So this will render our loader each time when somewhere in the app
  // something is loading
  return (
    <div className="grid h-screen grid-rows-[auto_1fr_auto] ">
      {isLoading && <Loader />}

      <Header />

      <div className="overflow-scroll">
        <main className="mx-auto max-w-3xl">
          <Outlet />
        </main>
      </div>
      <CartOverview />
    </div>
  );
}

export default AppLayout;

import { useLoaderData } from "react-router-dom";
import { getMenu } from "../../services/apiRestaurant";
import MenuItem from "./MenuItem";

function Menu() {
  const menu = useLoaderData(); // This is the custom hook provided by the react-router-dom , So it automatically loads the data from the
  // loader which we provided in the "/menu" route
  console.log(menu);
  return (
    <ul>
      {menu.map((pizza) => (
        <MenuItem pizza={pizza} key={pizza.id} />
      ))}
    </ul>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export async function loader() {
  const menu = await getMenu(); // This is an API request in the apiRestaurant.js file
  return menu;
}

export default Menu;
